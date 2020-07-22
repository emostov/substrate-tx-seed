import { ApiPromise } from '@polkadot/api';

// import { Keys } from '@polkadot/types/interfaces';
// import { MICRO, UNIT } from '../constants_and_types/constants';
import { AccountAndBlock } from '../constants_and_types/types';
import { Accounts, createAccounts } from '../methods/createAccounts';
import { signAndSendInfo } from '../methods/signAndSendInfo';

// https://polkadot.js.org/api/substrate/extrinsics.html#staking
export async function batch(api: ApiPromise): Promise<AccountAndBlock[]> {
	const info: AccountAndBlock[] = [];
	const keys: Accounts = await createAccounts();

	const innerMostBatch = api.tx.utility.batch([
		api.tx.staking.bondExtra(2222),
		api.tx.balances.transfer(keys.dave.address, 8080), // interrupted
		api.tx.staking.bondExtra(4444), // never executed
	]);

	const midBatch = api.tx.utility.batch([
		innerMostBatch,
		api.tx.staking.bondExtra(6666),
		api.tx.staking.bondExtra(33333),
		api.tx.balances.transfer(keys.dave.address, 4545), // interrupted
		api.tx.staking.bondExtra(5555), // never executed
	]);

	const outerBatch = api.tx.utility.batch([
		api.tx.staking.bondExtra(9999),
		midBatch,
	]);

	info.push(await signAndSendInfo(api, outerBatch, keys.aliceStash));

	return info;
}
