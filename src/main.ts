import { ApiPromise, WsProvider } from '@polkadot/api';

import { AccountAndBlock } from './constants_and_types/types';
// import { batch } from './seed_files/batch';
// import { session } from './seed_files/session';
import { system } from './seed_files/system';
import { createAccounts, Accounts } from './methods/createAccounts';
import { signAndSendInfo } from './methods/signAndSendInfo';
import { create } from 'domain';
// import { proxy } from './seed_files/proxy';
// import { staking } from './seed_files/staking';
// import { sudo } from './seed_files/sudo';
import { transfer } from './seed_files/transfer';

// This function should just create the api, coordinate calling the other
// scripts and compiling the data they return;
async function main(): Promise<AccountAndBlock[]> {
	// TODO move wsUrl to a configurable env
	const wsProvider = new WsProvider('ws://127.0.0.1:9944/');
	const api = await ApiPromise.create({ provider: wsProvider });

	let info: AccountAndBlock[] = [];
	let keys: Accounts = await createAccounts();

	info = info.concat(await transfer(api));

	// info = info.concat(await sudo(api));

	// info = info.concat(await staking(api));

	// info = info.concat(await batch(api));

	// info = info.concat(await proxy(api));

	// info = info.concat(await session(api));

	// info = info.concat(await system(api));
	//console.log(info);
	console.log(keys.eve.toJson());
	console.log(keys.dave.toJson());
	console.log(keys.bob.toJson());
	console.log(keys.sagan.toJson());

	// Ideally would feed data into reconciler to check the specific blocks.

	return info;
}

main().then(console.log).catch(console.error);
