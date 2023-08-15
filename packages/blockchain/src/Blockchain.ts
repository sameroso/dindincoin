import { createHash } from "crypto";

interface Transaction {
  sender: string;
  receiver: string;
  ammount: number;
}

interface Block {
  index: number;
  timeStamp: string;
  proof: number;
  previousHash: string;
  transactions: Transaction[];
}

export class Blockchain {
  private chain: Block[] = [];
  private transactions: Transaction[] = [];
  private nodes = new Set<string>();

  constructor() {
    this.createBlock();
  }

  get rawBlockchain() {
    return [...this.chain];
  }

  createBlock(proof = 1, previousHash = "0") {
    const block: Block = {
      index: this.chain.length + 1,
      timeStamp: new Date().toISOString(),
      proof,
      previousHash,
      transactions: this.transactions,
    };

    this.chain.push(block);
    this.transactions = [];
    return block;
  }

  get previousBlock() {
    const lastBlock = this.chain[this.chain.length - 1];
    return lastBlock;
  }

  generateHashOperation(newProof: number, previousProof: number) {
    const hash = createHash("sha256");
    const hashOperation = hash
      .update(Number(newProof ** 2 - previousProof ** 2).toString())
      .digest("hex");
    return hashOperation;
  }

  isOperationValid(hashOperation: string) {
    return hashOperation.startsWith("0000");
  }

  proofOfWork(previousProof: number) {
    let newProof = 1;
    let checkProof: boolean = false;

    while (checkProof === false) {
      const hashOperation = this.generateHashOperation(newProof, previousProof);
      if (this.isOperationValid(hashOperation)) {
        checkProof = true;
      } else {
        newProof = newProof + 1;
      }
    }
    return newProof;
  }

  hash<TBlock extends Record<string, any> = Record<string, any>>(
    block: TBlock
  ) {
    const ordered = Object.keys(block)
      .sort()
      .reduce((acc: Record<string, any>, key) => {
        acc[key] = block[key];
        return acc;
      }, {}) as TBlock;

    const encodedBlock = JSON.stringify(ordered);
    const hash = createHash("sha256");
    return hash.update(encodedBlock).digest("hex");
  }

  isChainValid(chain: Block[]) {
    for (let i = 1; i <= chain.length - 1; i++) {
      const previousBlock = chain[i - 1];
      const block = chain[i];

      if (block.previousHash !== this.hash(previousBlock)) return false;

      const previousProof = previousBlock.proof;
      const proof = block.proof;
      const hashOperation = this.generateHashOperation(proof, previousProof);
      if (!this.isOperationValid(hashOperation)) return false;
    }
    return true;
  }

  addTransaction(transaction: Transaction) {
    this.transactions.push(transaction);
    return this.previousBlock["index"] + 1;
  }

  addNode(address: string) {
    const host = new URL(address).host
    this.nodes.add(host);
  }
}
