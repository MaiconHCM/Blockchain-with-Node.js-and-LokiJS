import Block from '../model/block.js'
import Loki from 'lokijs'

// Functions to make asynchronous actions possible in LokiJS
Loki.prototype.loadDatabaseAsync = function (options) {
    return new Promise((resolve, reject) => this.loadDatabase(options, err => err ? reject(err) : resolve(null)))
}
Loki.prototype.saveDatabaseAsync = function() {
    return new Promise((resolve, reject) => this.saveDatabase(err => err ? reject(err) : resolve(null)))
}

export default class Blockchain {

    constructor(difficulty = 1) {
        this.blocks = []
        this.difficulty = difficulty
    }
    async load() {

        // Loading file 'blockChain.db' in lokiJS
        this.db = new Loki('database.db')
        await this.db.loadDatabaseAsync()
        
        // Checking if block table exists
        if(this.db.getCollection('blocks')){

            // If it exists, it will load the blocks and continue blockchain
            this.blocksCollection = this.db.getCollection('blocks')

            const blocks = this.blocksCollection.find()
            for (const key in blocks) {
                const block = blocks[key]
                this.blocks.push(new Block(block))
            }
            
            const lastBlock = this.blocks.at(-1)
            this.index = lastBlock.index + 1

        }else{

            // If it does not exist, the genesis block will be created, a new blockchain will start
            const genesisBlock = new Block({})
            this.blocks.push(genesisBlock)
            this.index = 1
            
            this.blocksCollection = this.db.addCollection('blocks')
            this.blocksCollection.insert(genesisBlock)
            await this.db.saveDatabaseAsync()
        }

    }

    getLastBlock() {
        return this.blocks[this.blocks.length - 1]
    }

    addBlock(data) {
        const index = this.index
        const difficulty = this.difficulty
        const previousHash = this.getLastBlock().hash
        const block = new Block({index, previousHash, data, difficulty})

        this.index++

        this.blocks.push(block)

        this.blocksCollection.insert(block)
        this.db.saveDatabase()
    }

    isValid() {
        for (const index in this.blocks) {
            const block = this.blocks[index]
            
            const currentBlock = block
            const previousBlock = this.blocks[index - 1]

            if (this.realizeChecks(currentBlock, previousBlock)) {
                return false
            }
        }

        return true
    }

    realizeChecks(currentBlock, previousBlock) {
        return this.checkHash(currentBlock)
            || this.checkIndexes(currentBlock, previousBlock)
            || this.checkPreviousHash(currentBlock, previousBlock)
    }

    checkHash(currentBlock) {
        return currentBlock.hash !== currentBlock.generateHash()
    }

    checkIndexes(currentBlock, previousBlock) {
        if (currentBlock.index === 0) {
            return
        }
        return currentBlock.index !== previousBlock.index + 1
    }

    checkPreviousHash(currentBlock, previousBlock) {
        if (currentBlock.index === 0) {
            return
        }
        return currentBlock.previousHash !== previousBlock.hash
    }

}