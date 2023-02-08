import sha256 from 'crypto-js/sha256.js'

export default class Block {

    constructor({index = 0, previousHash = null, data = "Bloco genesis", difficulty = 1, hash = null, timestamp = Date.now(), nonce = 0}) {
        this.index = index
        this.previousHash = previousHash
        this.data = data
        this.timestamp = timestamp
        this.difficulty = difficulty
        this.nonce = nonce
        if (hash)
            this.hash = hash
        else
            this.mine()
    }

    generateHash() {
        return sha256(this.index + this.previousHash + JSON.stringify(this.data) + this.timestamp + this.nonce).toString()
    }

    mine() {
        this.hash = this.generateHash()

        while (!(/^0*$/.test(this.hash.substring(0, this.difficulty)))) {
            this.nonce++
            this.hash = this.generateHash()
        }
    }
}