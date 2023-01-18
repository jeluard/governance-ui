## Run a local dev network

In order to run a local dev network you can use [zombienet](https://github.com/paritytech/zombienet).

### Prerequisite:

We run zombienet in Native mode so you need to have the polkadot binary in your path to be used by zombienet. You can either build polkadot locally and add it to your PATH or use zombinet setup command which is a utility script to download and set up required binaries in your local machine (currently the setup script only works on linux machines).

#### set up manually (works on MacOS and Linux):

- clone polkadot reposiroty on your machine:

```bash
> git clone https://github.com/paritytech/polkadot.git

> cd polkadot
```

- Run the following command to find the latest version.

```bash
> git tag -l | sort -V | grep -v -- '-rc'
```

- Build native code with the production profile.

```bash
> cargo build --profile production
```

- Add the polkadot binary to your path. e.g. in MacOS with zsh:

```bash
> echo 'export PATH=$PATH:<replace this with the path to polkat folder>/target/release' >> ~/.zshrc
```

verify polkadot is available in your PATH:

```bash
> polkadot --version
```

will out put sth like (the version will be the version you built in the previous steps):

```bash
polkadot 0.9.36-dc25abc712e
```

#### set up using Zombinet setup command (Only works on Linux):

if you use linux you can use zombienet's setup scripts to download polkadot dot binaries and set them in your path

```bash
yarn zombinet:setup
```

### Run a local network:

After you have set up zombinet env on your machine, you can run it to spawn a simple kusama local network:

```bash
yarn zombienet:run
```

this will spawn up a simple network with 2 validators with `kusama local` runtime.

```bash
╔════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ 🧟 Zombienet 🧟    │ Initiation                                                                                         ║
╟────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ Provider           │ native                                                                                             ║
╟────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ Namespace          │ zombie-abb10e69b6a66ce1a23198d9824c1258                                                            ║
╟────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ Temp Dir           │ /var/folders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/zombie-abb10e69b6a66ce1a23198d9824c1258_-77918-N… ║
╚════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════════════╝
┌────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Pod                │ temp                                                                                               │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Status             │ Launching                                                                                          │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Command            │ bash -c polkadot build-spec --chain kusama-local --disable-default-bootnode > /var/fo              │
│                    │ lders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/zombie-abb10e69b6a66ce1a23198d9824c1258_-77918-N         │
│                    │ llbtUVuohrf/cfg/kusama-local-plain.json                                                            │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐
│ Pod                                    │ temp                                                                           │
├────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ Status                                 │ Ready                                                                          │
└────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🧹 Starting with a fresh authority set...                                                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────┬────────────────────┬──────────────────────────────────────────────────────────────────────┐
│ 👤 Added Genesis Authority   │ alice              │ 5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY                     │
└──────────────────────────────┴────────────────────┴──────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────┬────────────────────┬──────────────────────────────────────────────────────────────────────┐
│ 👤 Added Staking             │ alice              │ 5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY                     │
└──────────────────────────────┴────────────────────┴──────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────┬────────────────────┬──────────────────────────────────────────────────────────────────────┐
│ 👤 Added Genesis Authority   │ bob                │ 5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc                     │
└──────────────────────────────┴────────────────────┴──────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────┬────────────────────┬──────────────────────────────────────────────────────────────────────┐
│ 👤 Added Staking             │ bob                │ 5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc                     │
└──────────────────────────────┴────────────────────┴──────────────────────────────────────────────────────────────────────┘
┌────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Pod                │ temp-1                                                                                             │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Status             │ Launching                                                                                          │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Command            │ bash -c polkadot build-spec --chain /var/folders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/              │
│                    │ zombie-abb10e69b6a66ce1a23198d9824c1258_-77918-NllbtUVuohrf/kusama-local-plain.json --disa         │
│                    │ ble-default-bootnode  --raw > /var/folders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/zombie-abb1         │
│                    │ 0e69b6a66ce1a23198d9824c1258_-77918-NllbtUVuohrf/kusama-local-raw.json                             │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐
│ Pod                                    │ temp-1                                                                         │
├────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ Status                                 │ Ready                                                                          │
└────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Chain name: Kusama Local Testnet                                                                                       ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Kusama Local Testnet ⚙ Clear Boot Nodes                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Pod                │ alice                                                                                              │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Status             │ Launching                                                                                          │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Command            │ polkadot --chain /var/folders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/zombie-abb10e69b6a6              │
│                    │ 6ce1a23198d9824c1258_-77918-NllbtUVuohrf/alice/cfg/kusama-local.json --name alice --rpc-co         │
│                    │ rs all --unsafe-rpc-external --rpc-methods unsafe --unsafe-ws-external -lparachain=debug -         │
│                    │ -no-mdns --node-key 2bd806c97f0e00af1a1fc3328fa763a9269723c8db8fac4f93af71db186d6e90 --no-         │
│                    │ telemetry --prometheus-external --validator --prometheus-port 62468 --rpc-port 62467 --ws-         │
│                    │ port 62466 --listen-addr /ip4/0.0.0.0/tcp/62465/ws --base-path /var/folders/c9/mbk_yy_51xz         │
│                    │ fhcgzkg4h7v5m0000gn/T/zombie-abb10e69b6a66ce1a23198d9824c1258_-77918-NllbtUVuohrf/alice/da         │
│                    │ ta                                                                                                 │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐
│ Pod                                    │ alice                                                                          │
├────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ Status                                 │ Ready                                                                          │
└────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
╔════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Pod                │ alice                                                                                              ║
╟────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ Status             │ Running                                                                                            ║
╟────────────────────╧────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ You can follow the logs of the node by running this command:                                                            ║
╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
tail -f  /var/folders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/zombie-abb10e69b6a66ce1a23198d9824c1258_-77918-NllbtUVuohrf/alice.log


┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Kusama Local Testnet ⚙ Added Boot Nodes                                                                                │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ /ip4/127.0.0.1/tcp/62465/ws/p2p/12D3KooWQCkBm1BYtkHpocxCwMgR8yjitEeHGx8spzcDLGt2gkBm                                   │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Pod                │ bob                                                                                                │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Status             │ Launching                                                                                          │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Command            │ polkadot --chain /var/folders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/zombie-abb10e69b6a6              │
│                    │ 6ce1a23198d9824c1258_-77918-NllbtUVuohrf/bob/cfg/kusama-local.json --name bob --rpc-cors a         │
│                    │ ll --unsafe-rpc-external --rpc-methods unsafe --unsafe-ws-external -lparachain=debug --no-         │
│                    │ mdns --node-key 81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce9 --no-tele         │
│                    │ metry --prometheus-external --validator --bootnodes /ip4/127.0.0.1/tcp/62465/ws/p2p/12D3Ko         │
│                    │ oWQCkBm1BYtkHpocxCwMgR8yjitEeHGx8spzcDLGt2gkBm --prometheus-port 62472 --rpc-port 62471 --         │
│                    │ ws-port 62470 --listen-addr /ip4/0.0.0.0/tcp/62469/ws --base-path /var/folders/c9/mbk_yy_5         │
│                    │ 1xzfhcgzkg4h7v5m0000gn/T/zombie-abb10e69b6a66ce1a23198d9824c1258_-77918-NllbtUVuohrf/bob/d         │
│                    │ ata                                                                                                │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────┘

```
