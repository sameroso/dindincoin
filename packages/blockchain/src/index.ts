import { Blockchain } from "./Blockchain";
import http from "http";

const blockchain = new Blockchain();

http
  .createServer((req, res) => {
    if (req.url === "/mineBlock") {
      const previousBlock = blockchain.previousBlock;
      const previousProof = previousBlock.proof;
      const previousHash = blockchain.hash(blockchain.previousBlock);
      const proof = blockchain.proofOfWork(previousProof);

      blockchain.createBlock(proof, previousHash);
    }
    res.end(
      `<h1>Dindincoin Blockchain</h1>
      <h2>${JSON.stringify(blockchain.previousBlock)}</h2>`
    );
  })
  .listen(3035, () => {
    console.log("listening on port 3035");
  });
