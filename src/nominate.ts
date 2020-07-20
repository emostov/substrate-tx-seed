/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * @ignore Don't show this file in documentation.
 */ /** */

import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {
	createSignedTx,
	createSigningPayload,
	decode,
	deriveAddress,
	getRegistry,
	// getTxHash,
	methods,
	POLKADOT_SS58_FORMAT,
} from '@substrate/txwrapper';

import { rpcToNode, signWith } from './utils';

/**
 * Entry point of the script. This script assumes a Polkadot node is running
 * locally on `http://localhost:9933`.
 */
async function main(): Promise<void> {
	// Wait for the promise to resolve async WASM
	await cryptoWaitReady();
	// Create a new keyring, and add an "Alice" account
	const keyring = new Keyring();
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'sr25519');
	console.log(
		"Alice's SS58-Encoded Address:",
		deriveAddress(alice.publicKey, POLKADOT_SS58_FORMAT)
	);

	// Construct a balance transfer transaction offline.
	// To construct the tx, we need some up-to-date information from the node.
	// `txwrapper` is offline-only, so does not care how you retrieve this info.
	// In this tutorial, we simply send RPC requests to the node.
	const { block } = await rpcToNode('chain_getBlock');
	const blockHash = await rpcToNode('chain_getBlockHash');
	const genesisHash = await rpcToNode('chain_getBlockHash', [0]);
	const metadataRpc = await rpcToNode('state_getMetadata');
	const { specVersion, transactionVersion } = await rpcToNode(
		'state_getRuntimeVersion'
	);

	// Create Polkadot's type registry.
	const registry = getRegistry('Polkadot', 'polkadot', specVersion);

	// Now we can create our `balances.transfer` unsigned tx. The following
	// function takes the above data as arguments, so can be performed offline
	// if desired.
	console.log('blockHash', blockHash);
	console.log(
		'blockNumber',
		registry.createType('BlockNumber', block.header.number).toNumber()
	);
	const unsigned = methods.staking.nominate(
		{
			targets: ['5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY'],
		},
		{
			address: deriveAddress(alice.publicKey, POLKADOT_SS58_FORMAT),
			blockHash,
			blockNumber: registry
				.createType('BlockNumber', block.header.number)
				.toNumber(),
			eraPeriod: 64,
			genesisHash,
			metadataRpc,
			nonce: 0, // Assuming this is Alice's first tx on the chain
			specVersion,
			tip: 0,
			transactionVersion,
		},
		{
			metadataRpc,
			registry,
		}
	);

	// // Decode an unsigned transaction.
	// const decodedUnsigned = decode(unsigned, {
	// 	metadataRpc,
	// 	registry,
	// });
	// console.log(
	// 	`\nDecoded Transaction\n  To: ${decodedUnsigned.method.args.dest}\n` +
	// 	`  Amount: ${decodedUnsigned.method.args.value}`
	// );

	// console.log(unsigned);

	// Construct the signing payload from an unsigned transaction.
	const signingPayload = createSigningPayload(unsigned, { registry });
	console.log(`\nPayload to Sign: ${signingPayload}`);

	// Sign a payload. This operation should be performed on an offline device.
	const signature = signWith(alice, signingPayload, {
		metadataRpc,
		registry,
	});
	console.log(`\nSignature: ${signature}`);

	// Serialize a signed transaction.
	const tx = createSignedTx(unsigned, signature, { metadataRpc, registry });
	console.log(`\nTransaction to Submit: ${tx}`);

	// // Derive the tx hash of a signed transaction offline.
	// const expectedTxHash = getTxHash(tx);
	// console.log(`\nExpected Tx Hash: ${expectedTxHash}`);
}

main().catch(console.log);
