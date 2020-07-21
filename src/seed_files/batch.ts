import { ApiPromise } from '@polkadot/api';
import { Keys } from '@polkadot/types/interfaces';

import { MICRO, UNIT } from '../constants_and_types/constants';
import { AccountAndBlock } from '../constants_and_types/types';
import { Accounts, createAccounts } from '../methods/createAccounts';
import { signAndSendInfo } from '../methods/signAndSendInfo';

// https://polkadot.js.org/api/substrate/extrinsics.html#staking
export async function batch(api: ApiPromise): Promise<AccountAndBlock[]> {
	const info: AccountAndBlock[] = [];
	const keys: Accounts = await createAccounts();

	// Failed
	// const doubleNestBatch = api.tx.utility.batch([
	// 	api.tx.staking.nominate([keys.bob.address]),
	// ]);

	// const nestedBatchTx = api.tx.utility.batch([
	// 	api.tx.staking.nominate([keys.dave.address]),
	// 	doubleNestBatch,
	// ]);

	// const topBatch = api.tx.utility.batch([
	// 	api.tx.staking.bondExtra(12345678),
	// 	nestedBatchTx,
	// ]);

	const doubleNestBatch = api.tx.utility.batch([
		api.tx.staking.nominate([keys.bob.address]),
	]);

	const nestedBatchTx = api.tx.utility.batch([
		api.tx.staking.nominate([keys.dave.address]),
		doubleNestBatch,
	]);

	const topBatch = api.tx.utility.batch([
		api.tx.staking.nominate([keys.eve.address]),
		nestedBatchTx,
	]);

	info.push(await signAndSendInfo(api, topBatch, keys.alice));

	return info;
}
