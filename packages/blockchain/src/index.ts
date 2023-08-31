import { Blockchain, Transaction } from "./Blockchain";
import http from "http";
import crypto from "crypto";

const nodeAddress = crypto.randomUUID().replace("-", "");
const blockchain = new Blockchain();

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");

    if (req.url === "/mineBlock") {
      const previousBlock = blockchain.previousBlock;
      const previousProof = previousBlock.proof;
      const previousHash = blockchain.hash(blockchain.previousBlock);
      const proof = blockchain.proofOfWork(previousProof);
      blockchain.addTransaction({
        ammount: 1,
        receiver: "samer",
        sender: nodeAddress,
      });

      const block = blockchain.createBlock(proof, previousHash);
      res.end(JSON.stringify(block));

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

    if (
      req.url === "/addTransaction" &&
      (req.method === "post" || req.method === "POST")
    ) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const transaction: Transaction = JSON.parse(body);
        blockchain.addTransaction(transaction);
        res.statusCode = 200;
        res.end(JSON.stringify({ ...transaction }));
      });
    }
  })
  .listen(3035, () => {
    console.log("listening on port 3035");
  });
