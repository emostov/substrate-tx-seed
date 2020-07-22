import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';

export type Accounts = {
	alice: KeyringPair;
	aliceStash: KeyringPair;
	bob: KeyringPair;
	dave: KeyringPair;
	sagan: KeyringPair;
	eve: KeyringPair;
};

export async function createAccounts(): Promise<Accounts> {
	// References
	// https://github.com/paritytech/substrate/blob/833fe6259115625f61347c8413bab29fded31210/primitives/core/src/crypto.rs#L52
	// Alice is 'bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice'

	await cryptoWaitReady();

	const keyring: Keyring = new Keyring();

	// Alice is the standard sudo account on dev chains
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'sr25519');

	const aliceStash = keyring.addFromUri(
		'//Alice//stash',
		{ name: 'Alice Stash' },
		'sr25519'
	);
	const bob = keyring.addFromUri('//Bob', { name: 'Bob' }, 'sr25519');
	const dave = keyring.addFromUri('//Dave', { name: 'Dave' }, 'sr25519');
	const sagan = keyring.addFromUri('//Sagan', { name: 'Sagan' }, 'sr25519');
	const eve = keyring.addFromUri('//Eve', { name: 'Eve' }, 'sr25519');

	return {
		alice,
		aliceStash,
		bob,
		dave,
		sagan,
		eve,
	};
}
