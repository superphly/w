import { mkdirSync, createWriteStream } from "fs";
const { Console } = console; 
import { Bip39, Random } from "@cosmjs/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

// 
const NUM_WALLETS = process.argv[2] ?? 10;
const W_NAME = process.argv[3] ?? 'error';


// Create wallets dir for output files
mkdirSync(`./wallets/public`, {recursive: true});
mkdirSync(`./wallets/private`, {recursive: true});

// File Outputs
const privFile = createWriteStream(`./wallets/private/${W_NAME}-privkeys`);
const pubFile = createWriteStream(`./wallets/public/${W_NAME}-pubkeys`);

// Helpers to Write to filesystem
const privOut = new Console({ stdout: privFile });
const pubOut = new Console({ stdout: pubFile });

// getBytes Length
const length = 4 * Math.floor((11 * 24) / 33);

async function generateWallet() {
  const entropy = Random.getBytes(length);
  const mnemonic = Bip39.encode(entropy).toString();
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "andr",
  });
  const address = (await wallet.getAccounts())[0].address;

  return {mnemonic, address};
}

async function start() {
  
  const w = [];

  for (let i = 0; i < NUM_WALLETS; i++) {
    w.push(await generateWallet());
  }

  for (let i = 0; i < NUM_WALLETS; i++) {
    let zi = ('00'+i).slice(-2);
    let privLine = `Wallet ${W_NAME} #${zi}\nMnemonic:\t${w[i].mnemonic}\nAddress:\t${w[i].address}\n`;
    let pubLine = `Wallet ${W_NAME} #${zi}\t${w[i].address}`;
    privOut.log(privLine);
    pubOut.log(pubLine);
    console.log(pubLine);
  }
}

start();
