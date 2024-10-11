# Blockchain Implementaion in Node.js

## Table of contents
...

## Project Overview



## Features
- A node can create transactions and broadcast them. :heavy_check_mark:
- A node can validate the transactions received from the network: just receive a recently created transaction and validate the signature and the value - if valid, this transaction is added to local mempool. :heavy_check_mark:
- A node can mine the transactions (from his memPool), using the **proof of work system**. :heavy_check_mark:
- Mempool: the structure responsable for storing the unvalidated blocks - are local to each node. :heavy_check_mark:
- By convention, every node will be a miner, and a regular node. Every node does everything. :heavy_check_mark:
- Network: Nodes can register to the network by connecting to a known peer. Once connected, this peer can provide the new one a list of known peers, so it can find all the others. The known peer will also broadcast the new node to the network. :heavy_check_mark:
    - When init the app, set up a local node to serve as the first peer.:heavy_check_mark:
- Script that setup the instances of the app to connect with one another. :heavy_check_mark:

P2P comunication: the protocol used to one node comunicate with others and disseminate informations across the network. :heavy_check_mark:

## Demonstration


## Tasks
- Node registry mechanism: a node, as soon as it is up, should find another already node running in the network and connect to it. :heavy_check_mark:
- Decode data received via network. :heavy_check_mark:
- Create a service that manage the network system:
    - Connects and broadcast to multiple nodes at same time. :heavy_check_mark:
    - Handle incoming requests accord with the protocol (one for valid, other for mempool, etc) :heavy_check_mark:
- Implement a chain sync service: time to time we need to compare the local chain with the one in the network. The chain version accepted is the one used by most nodes.


  
## Getting Started

## Contribute

