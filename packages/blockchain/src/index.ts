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

      const block = blockchain.createBlock(proof, previousHash);
      res.end(
        `<div><h1>Bloco minerado!</h1><h2>${JSON.stringify(block)}></h2></div>`
      );
      return;
    }
    if (req.url === "/checkChainValidity") {
      const chain = blockchain.rawBlockchain;
      const isBlockchainValid = blockchain.isChainValid(chain);
      res.end(
        `<h1>Dindincoin Blockchain</h1>
        <h2>${
          isBlockchainValid
            ? "Your Blockchain is valid"
            : "Your Blokchain is invalid"
        }</h2>`
      );
      return;
    }

    if (req.url === "/getChain") {
      res.end(JSON.stringify(blockchain.rawBlockchain));
    }
    
  })
  .listen(3035, () => {
    console.log("listening on port 3035");
  });
