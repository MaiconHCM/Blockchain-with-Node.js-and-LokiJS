// Basic blockchain project developed by Maicon Henrique Cordeiro Machado.
// Github: https://github.com/MaiconHCM
// Linkedin: https://www.linkedin.com/in/maiconhcm

import Blockchain from "./controller/blockchain.js"

// Start new blockchain class
const blockchain = new Blockchain()

// Load if exist DATABASE in LokiJS (you can use your database), using 'await' to wait for completion
await blockchain.load()

// Generating test data
const blockchainSize = 10
for (let i = 0; i <= blockchainSize - 1; i++) {
    blockchain.addBlock({
        message: `This is record number N°${i}`,
        value: Math.random() * 5000
    })
}

// Checking Blockchain Integrity.
console.log(`This blockchain has data integrity? : ${blockchain.isValid()}`);