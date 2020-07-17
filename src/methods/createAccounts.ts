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
	// Still don't understand the purpose of cryptoWaitReady
	await cryptoWaitReady();

	const keyring: Keyring = new Keyring();

	// Alice is the standard sudo account on dev chains
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'sr25519');
	// Need to make sure this works as I think, for now just using as an address to nominate
	const aliceStash = keyring.addFromUri(
		'//Alice//stash',
		{ name: 'Alice Stash' },
		'sr25519'
	);
	const bob = keyring.addFromUri('plug wedding cause similar muscle march car jacket lunar satisfy delay acoustic', { name: 'Bob' }, 'sr25519');
	const dave = keyring.addFromUri('topple catalog strike shop wave border switch fiction document ship bracket banner', { name: 'Dave' }, 'sr25519');
	const sagan = keyring.addFromUri('please cabbage jelly build range bone slim review region insect wave echo', { name: 'Sagan' }, 'sr25519');
	const eve = keyring.addFromUri('retreat remove board sea blush sudden climb hundred forward juice like toe', { name: 'Eve' }, 'sr25519');

	return {
		alice,
		aliceStash,
		bob,
		dave,
		sagan,
		eve,
	};
}
