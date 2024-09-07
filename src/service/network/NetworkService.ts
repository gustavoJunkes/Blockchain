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


export class NetworkService {   
    
    private peerAdress = '/ip4/127.0.0.1/tcp/9000/p2p/12D3KooWAQzFCSdWAP3sqNepvZ2wddmzHmQ9id5Us7ag4zGBys4h';
    private port = '8000'

    private static instance: NetworkService;

    static getInstance(): NetworkService {
        if (!NetworkService.instance) {
            NetworkService.instance = new NetworkService();
        }
        return NetworkService.instance;
    }

    // Known peers addresses - just dummy value, no node is running in the network by default
    bootstrapMultiaddrs = [
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
    ]

    private node: Libp2p | undefined

    async setupNode() {
        // create a new node
        this.node = await createLibp2p({
            start: false,
            addresses: {
                listen: [`/ip4/127.0.0.1/tcp/${this.port}`]
            },
            transports: [tcp()],
            connectionEncryption: [noise()],
            streamMuxers: [yamux()], // maybe not usefull for us
            peerDiscovery: [ 
                bootstrap({
                  list: this.bootstrapMultiaddrs, // for basic setup we are using this one, but in the future should use the @libp2p/mdns
                })
              ]
        })

        this.handleConnections();
        
        await this.node.start();
        console.log('libp2p has started')

        const listenAddrs = this.node.getMultiaddrs()
        console.log('libp2p is listening on the following addresses: ', listenAddrs)
    }

    /**
     * Here we handle the connections to this node, using the specified protocol.
     */
    private async handleConnections() {
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
                    // TODO: stop any mining operation and refetch the chain to keep consistency.
                    ChainService.getInstance().addBlock(value2);
                }
                }
              )
        });

    }

    /**
     * Used to connect to node in given address and send data
     */
    private async dialNode(peerAddress: string, protocol: string, data: any) {
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

    async stop() {
        if (this.node) {
            await this.node.stop();
            console.log('libp2p has stopped');
        }
    }

    public publicTransactionToValidation(transactionMetadata: TransactionMetadata) {
        console.log('------- transactionMetadata.serialize() -------')
        console.log(transactionMetadata.serialize())
        console.log('---')
        console.log(transactionMetadata.serialize())
        this.dialNode(this.peerAdress, '/validate-transaction', transactionMetadata.serialize());
    }

    public broadcastNewBlock(block: Block) {
        this.dialNode(this.peerAdress, '/new-block', block.serialize());
    }
}



