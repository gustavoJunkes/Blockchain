import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { multiaddr } from '@multiformats/multiaddr'
import { Stream } from '@libp2p/interface-connection'; 

export class NetworkService {
    
    private static instance: NetworkService;

    static getInstance(): NetworkService {
        if (!NetworkService.instance) {
            NetworkService.instance = new NetworkService();
        }
        return NetworkService.instance;
    }

    // Known peers addresses
    bootstrapMultiaddrs = [
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
    ]

    private node: any;

    async setupNode() {
        // create a new node
        this.node = await createLibp2p({
            start: false,
            addresses: {
                listen: ['/ip4/127.0.0.1/tcp/8000']
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

        // handle connections
        this.node.handle('/tcp', async ({ stream }: { stream: Stream }) => {
            console.log('Received a connection!');
            console.log(stream)
        });
        
        await this.node.start();
        console.log('libp2p has started')


        // // i still dont have any node to cnnect ...
        // const ma = multiaddr('/ip4/127.0.0.1/tcp/8000/p2p/12D3KooWHCMjDdbUCPuUjTSt3dnypuKLrr2wjprDFy2kw9fD3PDh') // here the addrs of the other node running... 

        // // dial a TCP connection, timing out after 10 seconds - wont work if there is no node listening in this address.
        // const connection = await this.node.dial(ma, {
        //     signal: AbortSignal.timeout(10_000)
        // })  

        const listenAddrs = this.node.getMultiaddrs()
        console.log('libp2p is listening on the following addresses: ', listenAddrs)
    }

    /**
     * Used to connect to node in given address
     * 
     */
    async dialNode(peerAddress: string) {
        const ma = multiaddr(peerAddress);

        try {
            const connection = await this.node.dial(ma, {
                signal: AbortSignal.timeout(10_000)
            });
            console.log('Connected to', peerAddress);
        } catch (error) {
            console.error('Failed to connect:', error);
        }
    }

    async stop() {
        if (this.node) {
            await this.node.stop();
            console.log('libp2p has stopped');
        }
    }
}