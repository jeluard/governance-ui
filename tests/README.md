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

if sucessful you will see the following at the end of the command output:

```bash
All relay chain nodes spawned...
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          Network launched 🚀🚀                                                                                          │
├──────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Namespace                    │ zombie-e27149c74dbae967275101acc2783f78                                                                                                                                  │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Provider                     │ native                                                                                                                                                                   │
├──────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            Node Information                                                                                             │
├──────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Name                         │ alice                                                                                                                                                                    │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Direct Link                  │ https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:62660#/explorer                                                                                                         │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Prometheus Link              │ http://127.0.0.1:62662/metrics                                                                                                                                           │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Log Cmd                      │ tail -f  /var/folders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/zombie-e27149c74dbae967275101acc2783f78_-78445-Q1dYdUrogiO0/alice.log                                          │
├──────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            Node Information                                                                                             │
├──────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Name                         │ bob                                                                                                                                                                      │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Direct Link                  │ https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:62664#/explorer                                                                                                         │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Prometheus Link              │ http://127.0.0.1:62666/metrics                                                                                                                                           │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Log Cmd                      │ tail -f  /var/folders/c9/mbk_yy_51xzfhcgzkg4h7v5m0000gn/T/zombie-e27149c74dbae967275101acc2783f78_-78445-Q1dYdUrogiO0/bob.log                                            │
└──────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


```
