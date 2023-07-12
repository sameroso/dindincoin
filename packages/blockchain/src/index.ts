import { Blockchain } from "./Blockchain";

const blockchain = new Blockchain();

console.log(blockchain.hash({ test1: "Test1", test: "test2" }));
