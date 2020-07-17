/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ApiPromise } from '@polkadot/api';

// import { MICRO, UNIT } from '../constants_and_types/constants';
import { UNIT } from '../constants_and_types/constants';
import { AccountAndBlock } from '../constants_and_types/types';
import { Accounts, createAccounts } from '../methods/createAccounts';
import { signAndSendInfo } from '../methods/signAndSendInfo';

export async function transfer(api: ApiPromise): Promise<AccountAndBlock[]> {
	// Lets keep track of important blocks we want to look at later
	const info: AccountAndBlock[] = [];

	const keys: Accounts = await createAccounts();

	const transferTo = api.tx.balances.transfer(keys.bob.address, 1060 * UNIT);
	const batch = api.tx.utility.batch([transferTo]);
	const txInfo = await signAndSendInfo(api, batch, keys.alice);

	info.push(txInfo);

	return info;
}
