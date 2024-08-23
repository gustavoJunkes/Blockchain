import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { multiaddr } from '@multiformats/multiaddr'


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

    async setup() {
        // create a new node
        const node = await createLibp2p({
            start: false,
            addresses: {
                listen: ['/ip4/127.0.0.1/tcp/8000/ws']
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

        const ma = multiaddr('/ip4/123.123.123.123/tcp/1234') // here the 

        // dial a TCP connection, timing out after 10 seconds
        const connection = await node.dial(ma, {
            signal: AbortSignal.timeout(10_000)
        })

    

        await node.start();
        console.log('libp2p has started')

        const listenAddrs = node.getMultiaddrs()
        console.log('libp2p is listening on the following addresses: ', listenAddrs)

        // in case we wanna stop 
        await node.stop()
        console.log('libp2p has stopped')
    }

}