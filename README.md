# Blockchain Implementaion in Node.js

## Table of contents
...

## Project Overview

## Features
- A node can create transactions and broadcast them.
- A node can validate the transactions received from the network: just receive a recently created transaction and validate the signature and the value - if valid, this transaction is added to local mempool.
- A node can mine the transactions, using the **proof of work system**.
- Mempool: the structure responsable for storing the unvalidated blocks - are local to each node.
- By convention, every node will be a miner, and a regular node. Every node does everything.
- Network: Nodes can register to the network by connecting to a known peer. Once connected, this peer can provide the new one a list of known peers, so it can find all the others. The known peer will also broadcast the new node to the network.

P2P comunication: the protocol used to one node comunicate with others and disseminate informations across the network.

## Tasks
- Node registry mechanism: a node, as soon as it is up, should find another already node running in the network and connect to it.

## Getting Started

## Contribute

