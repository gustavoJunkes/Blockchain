# Blockchain Implementaion in Node.js

## Table of contents
...

## Project Overview

This is a simple Blockchain implementation using NodeJs. We simulate a network of nodes using docker, where each node is a container in the network.

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


## To do
- Node registry mechanism: a node, as soon as it is up, should find another already node running in the network and connect to it. :heavy_check_mark:
- Decode data received via network. :heavy_check_mark:
- Create a service that manage the network system:
    - Connects and broadcast to multiple nodes at same time. :heavy_check_mark:
    - Handle incoming requests accord with the protocol (one for valid, other for mempool, etc) :heavy_check_mark:
- Implement a chain sync service: time to time we need to compare the local chain with the one in the network. The chain version accepted is the one used by most nodes.

## Demonstration

First we start the network by running the docker compose script.

After starting, we can choose a node and send a request to create a new transaction:
![alt text](image-1.png)

Imediatly after creation, the transaction is published to the network and each node receiving will validate and add it to its local memory pool.

We can consult the node memory pool:
![alt text](image-2.png)

Each node will try to mine the transactions in their local memory pool, and after that add it to the chain:

## Getting Started

### Runing on your machine

In order to make the deployment and tests easier, the whole application starts and set up with a docker-compose script.

So to run and try it locally, you will need docker and docker compose installed.

Once you have cloned the repository, you can run using the `` docker compose up `` command.

The script will automaticly create 3 containers, each with an instance of the blockchain. 

Each node public the port 3000 + its index (1,2 or 3).

Nodes also provide endpoints that help us understanding and debugging what is happening under the sheets:
- `` /api/app/mempool ``: Will return a list of the transactions in the mempool of that node.
- `` /api/app/chain ``: Return the blockchain version of that node.
- `` /api/app/new-transaction ``: Is the entrypoint for creating transactions in the network.





## Contribute

At the moment, the best way of contributing is to open an issue stating your suggestion, question or problem. From there we can discuss a better aproach for the situation.
