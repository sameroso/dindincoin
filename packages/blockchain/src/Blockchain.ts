interface Block {
  index: number;
  timeStamp: string;
  proof: number;
  previousHash: string;
}

export class Blockchain {
  private chain: Block[] = [];

  constructor() {
    this.createBlock();
  }

  private createBlock(proof = 1, previousHash = "0") {
    const block: Block = {
      index: this.chain.length + 1,
      timeStamp: new Date().toLocaleDateString(),
      proof,
      previousHash,
    };

    this.chain.push(block);
    return block;
  }

  get previousBlock() {
    const lastBlock = this.chain[this.chain.length - 1];
    return lastBlock;
  }
}
