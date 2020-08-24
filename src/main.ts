import { ApiPromise, WsProvider } from '@polkadot/api';

async function main(): Promise<void> {
	const wsProvider = new WsProvider('wss://cc3-5.kusama.network');
	const api = await ApiPromise.create({
		provider: wsProvider,
	});

	// Kusama block 900
	const hash =
		'0xc6ec2b15cc9436d9b494e917511f283b29d337984d858e4324aad452d8265aa1';

	const block = await api.rpc.chain.getBlock(hash);

	console.log(
		block.block.extrinsics.forEach((e) => console.log(e.toHuman()))
	);
}

main().catch(console.error);
