import { Libp2p, createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { multiaddr } from '@multiformats/multiaddr'
import { pipe } from 'it-pipe'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

export class NetworkService {
    
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
                listen: ['/ip4/127.0.0.1/tcp/9000']
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

        this.node?.handle('/node-connect', async ( {stream} ) => {
            pipe(
                stream,
                async function (source) {
                  for await (const msg of source) {
                    console.log('Msg: ' + uint8ArrayToString(msg.subarray()))
                  }
                }
              )
        });
    }

    /**
     * Used to connect to node in given address and send data
     */
    async dialNode(peerAddress: string, data: string) {
        const ma = multiaddr(peerAddress);

        try {
            // Dial to the remote peer with the specified protocol
            const stream = await this.node?.dialProtocol(ma, '/node-connect', {
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
                console.error('Failed to get stream');
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
}



