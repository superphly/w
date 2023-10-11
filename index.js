const { Bip39, Random } = require("@cosmjs/crypto");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");

const NUM_WALLETS = process.env.NUM_WALLETS ?? 15;
const length = 4 * Math.floor((11 * 24) / 33);

async function generateWallet() {
  const entropy = Random.getBytes(length);
  const mnemonic = Bip39.encode(entropy).toString();
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "andr",
  });
  const address = (await wallet.getAccounts())[0].address;

  return [mnemonic, address];
}

async function start() {
  for (let i = 0; i < NUM_WALLETS; i++) {
    const [mnemonic, address] = await generateWallet();
    console.log(`Mnemonic: ${mnemonic}`);
    console.log(`Address: ${address}`);
    console.log(`\n`);
  }
}

start();
