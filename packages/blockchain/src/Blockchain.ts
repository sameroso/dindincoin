import { createHash } from "crypto";

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

  proofOfWork(previousProof: number) {
    let newProof = 1;
    let checkProof: boolean = false;

    while (checkProof === false) {
      const hash = createHash("sha256");
      const hashOperation = hash
        .update(Number(newProof ** 2 - previousProof ** 2).toString())
        .digest("hex");

      if (hashOperation.startsWith("0000")) {
        checkProof = true;
      } else {
        newProof = newProof + 1;
      }
    }
    return newProof;
  }

  hash(block: Record<string, any>) {
    const ordered = Object.keys(block)
      .sort()
      .reduce((obj: Record<string, any>, key) => {
        obj[key] = block[key];
        return obj;
      }, {});
    const encodedBlock = JSON.stringify(ordered);
    const hash = createHash("sha256");
    return hash.update(encodedBlock).digest("hex");
  }
}
