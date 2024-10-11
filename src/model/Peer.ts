export class Peer {
    name: string;
    address: string;
    status: string;
    genesis: boolean

    constructor(name: string, address: string, status: string, genesis: boolean) {
        this.name = name;
        this.address = address;
        this.status = status;
        this.genesis = genesis;
    }
}