import { ApiPromise, WsProvider } from '@polkadot/api';

async function main(): Promise<void> {
	const wsProvider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({
		provider: wsProvider,
	});

	const hash1378238 =
		'0xbc38431a6a4e0cdaadd3b34d1fd1d6692cb08ff07d58bb1726101d341f100892'; // polkadot block number 1378238
	const firstTry1378238 = await api.derive.chain.getHeader(hash1378238);
	console.log('This works: (firstTry1378238) ', firstTry1378238?.toHuman());

	const secondTry1378238 = await api.derive.chain.getHeader(hash1378238);
	console.log('This works: (secondTry1378238) ', secondTry1378238?.toHuman());

	const hash1 =
		'0xc0096358534ec8d21d01d34b836eed476a1c343f8724fa2153dc0725ad797a90'; // polkadot block number 1

	const firstTry1 = await api.derive.chain.getHeader(hash1);
	console.log('This works: (firstTry1)', firstTry1?.toHuman());

	const secondTry1 = await api.derive.chain.getHeader(hash1);
	// Logs to console: Unable to decode Vec on index 0 Tuple: failed on 0:: Invalid character
	console.log(
		'This will not log to console (secondTry1)',
		secondTry1?.toHuman()
	);
}

main().catch(console.error);
