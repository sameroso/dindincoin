import { Blockchain } from "./Blockchain";
import http from "http";

const blockchain = new Blockchain();

http
  .createServer((req, res) => {
    res.end(
      `<h1>Dindincoin Blockchain</h1>
      <h2>${JSON.stringify(blockchain.previousBlock)}</h2>`
    );
  })
  .listen(3035, () => {
    console.log("listening on port 3035");
  });
