import { Libp2p, createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { multiaddr } from '@multiformats/multiaddr'
import { TransactionMetadata } from "../../model/TransactionMetadata.js";
import { pipe } from "it-pipe";
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { ValidationService } from "../ValidationService.js";
import { Block } from "../../model/Block.js";
import { ChainService } from "../ChainService.js";
import { FileSevice } from "../FileService.js";
import { gossipsub, GossipSub } from "@chainsafe/libp2p-gossipsub";
import { identify } from "@libp2p/identify";
import { mdns } from "@libp2p/mdns";
import { Peer } from "../../model/Peer.js";
import { MemPoolService } from "../MemPoolService.js";
import { MiningService } from "../MiningService.js";


export class NetworkService {   
    
    private peerAdress = '/ip4/node_1/tcp/8000' // '/ip4/127.0.0.1/tcp/9000/p2p/12D3KooWAQzFCSdWAP3sqNepvZ2wddmzHmQ9id5Us7ag4zGBys4h';
    private port = '8000' // get from env variable

    private static instance: NetworkService;

    static getInstance(): NetworkService {
        if (!NetworkService.instance) {
            NetworkService.instance = new NetworkService();
        }
        return NetworkService.instance;
    }

    private node: Libp2p | undefined

    async setupNode() {
        // here we can control the bootstrap logic
        const genesisNode = this.getGenesisNode();
        let genesisNodeAddress: string = genesisNode.address;

        // create a new node
        this.node = await createLibp2p({
            start: false,
            addresses: {
                listen: [`/ip4/0.0.0.0/tcp/${this.port}`]
            },
            transports: [tcp()],
            connectionEncryption: [noise()],
            streamMuxers: [yamux()], // maybe not usefull for us
            services: {
                pubsub: gossipsub({emitSelf: false}),
                identify: identify()
              },
            peerDiscovery: [
                mdns(),
                bootstrap({
                    list: [
                        genesisNodeAddress
                    ]
                })
            ]
        })

        await this.node.start();
        console.log('libp2p has started')

        const listenAddrs = this.node.getMultiaddrs();
        const peer = {peerName: 'node_01', address: listenAddrs[0].toString(), status: 'running', genesis: true};
        console.log('libp2p is listening on the following addresses: ', listenAddrs)
        FileSevice.getInstance().savePeer(peer); 

        this.handleDirectConnections();
        this.listenToBroadcasts();      
        this.subscribeToTopic('validate-transaction');
        this.subscribeToTopic('memory-pool');
        this.subscribeToTopic('new-block');
    }


    private async listenToBroadcasts() {
        const pubsub = this.node?.services.pubsub as GossipSub;

        pubsub.addEventListener('message', (event) => {
            console.log('Message received:', event.detail);
            const decodedValue = new TextDecoder().decode(event.detail.data);

            const topic = event.detail.topic;
            
            console.log(`Received connection for topic [${topic}]`)

            if (topic === 'validate-transaction') {
                const transactionData = TransactionMetadata.deserialize(decodedValue);
                ValidationService.getInstance().validateTransaction(transactionData.transaction, transactionData.senderPublicKey, transactionData.signature);
            } else if (topic === 'new-block') {
                const blockData = Block.deserialize(decodedValue);
                // TODO: stop any mining operation and refetch the chain to keep consistency.
                ChainService.getInstance().addBlock(blockData);
            } else if (topic === 'memory-pool') {
                const transactionData = TransactionMetadata.deserialize(decodedValue);
                MemPoolService.getInstance().addToMemPool(transactionData);
            }
        });
    
    }

    /**
     * Here we handle the connections made directly to this node, using the specified protocol.
     * This method shouldnt be used for broadcasting - but only in exceptional cases where we need direct communications with a specific node.
     */
    private async handleDirectConnections() {
        this.node?.handle('/node-connect', async ( {stream}: any ) => {
            pipe(
                stream,
                async function (source) {
                  for await (const msg of source) {
                    var value = uint8ArrayToString(msg.subarray())
                    console.log('Msg: ' + value)
                    JSON.parse(value);
                  }
                }
              )
        });

        /**
         * Handle transactions received to validate.
         */
        this.node?.handle('/validate-transaction', async ( {stream}: any ) => {
            pipe(
                stream,
                async function (source) {
                  for await (const msg of source) {
                    var value = uint8ArrayToString(msg.subarray())
                    const value2 = TransactionMetadata.deserialize(value);
                    ValidationService.getInstance().validateTransaction(value2.transaction, value2.senderPublicKey, value2.signature);
                  }
                }
              )
        });

        /**
         * Handle new blocks being created (mined) by other nodes.
         */
        this.node?.handle('/new-block', async ( {stream}: any ) => {
            pipe(
                stream,
                async function (source) {
                    for await (const msg of source) {
                        const value2 = Block.deserialize(uint8ArrayToString(msg.subarray()));
                        // TODO: stop any mining operation and refetch the chain to keep consistency. --> when i receive a new block, its a signal that i have to stop any mining and refetch the chain because it has been changed...
                        ChainService.getInstance().addBlock(value2);
                    }
                }
              )
        });

        this.node?.handle('/mined-transaction', async ( {stream}: any ) => {
            pipe(
                stream,
                async function (source) {
                  for await (const msg of source) {
                    var value = uint8ArrayToString(msg.subarray())
                    const value2 = TransactionMetadata.deserialize(value);
                    MiningService.getInstance().handleNewMinedTransaction(value2)
                }
                }
              )
        });
    }

    private getGenesisNode(): Peer {
        const peers = FileSevice.getInstance().getPeers();
        const peer = peers[peers.length-1];

        return peer;
    }

    /**
     * Used to connect to node in given address and send data.
     * From now on this method resolves the address to send the data.
     */
    private async dialNode(peerAddress: string, protocol: string, data: any) {
        const peers = FileSevice.getInstance().getPeers();
        const peer = peers[peers.length-1];
        peerAddress = peer.address;

        const selfAddress = this.node?.getMultiaddrs()[0].toString();

        // cant connect to itself
        if (selfAddress === peerAddress) {
            console.log('Attempt of self connection intercepted.')
            return;
        }

        const ma = multiaddr(peerAddress);

        try {
            // Dial to the remote peer with the specified protocol
            const stream = await this.node?.dialProtocol(ma, protocol, {
                signal: AbortSignal.timeout(10_000)
            });

            if (stream) {
                console.log('Connected to', peerAddress);
   
                // Convert the data to Uint8Array and wrap it in an array
                const encoder = new TextEncoder();
                const encodedData = encoder.encode(data);
                await stream.sink([encodedData]);
                console.log('Data sent:', data);
            } else {
                console.error('Failed to get stream - Verify if the node is connected to the network.');
            }
        } catch (error) {
            console.error('Failed to connect or send data:', error);
        }
    }

    /**
     * In this method we broadcast the message to the given topic. Any node subscribed to this topic will receive the message.
     * @param topic 
     * @param content is the content to be published. Objects need to be encoded into json string using JSON.stringfy() before calling this method
     */
    broadcastToNetwork(topic: string, content: string) {
        const pubsub = this.node?.services.pubsub as GossipSub;
        pubsub.publish(topic, new TextEncoder().encode(content));
    }

    /**
     * This method centralizes the topic subscription
     * @param topic the topic to subscribe
     */
    subscribeToTopic(topic: string) {
        const pubsub = this.node?.services.pubsub as GossipSub;
        pubsub.subscribe(topic);
    }

    async stop() {
        if (this.node) {
            await this.node.stop();
            console.log('libp2p has stopped');
        }
    }

    /**
     * Here we publish the transaction to be validate by the other nodes.
     * @param transactionMetadata the transaction data that will be published
     */
    public publicTransactionToValidation(transactionMetadata: TransactionMetadata) {
        console.log('Broadcasting transaction to validation...');
        this.broadcastToNetwork('validate-transaction', transactionMetadata.serialize());

    }

    public broadcastTransactionMemPool(transactionMetadata: TransactionMetadata) {
        console.log('Broadcasting a new unprocessed transaction for memory pools...')
        this.broadcastToNetwork('memory-pool', transactionMetadata.serialize());
    }

    public broadcastNewBlock(block: Block) {
        console.log('Broadcasting a new block to the network...')
        this.broadcastToNetwork('new-block', block.serialize());
    }

    public broadcastMinedTransaction(transaction: TransactionMetadata) {
        console.log('Broadcasting a mined transaction to the network...')
        this.broadcastToNetwork('mined-transaction', transaction.serialize());
    }
}



