import { ApiPromise, WsProvider } from '@polkadot/api';
import { Vec } from '@polkadot/types';
import { EventRecord } from '@polkadot/types/interfaces';

async function main(): Promise<void> {
	const wsProvider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({
		provider: wsProvider,
	});

	const mapEvents = (events: Vec<EventRecord>) => {
		// console.log(events.toHuman());
		return events
			.map(({ event: { data, section, method } }) => {
				if (section && method) {
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					return `${section}.${method} - data: ${data.toString()}`;
				} else {
					return 'WARN: event missing section and method';
				}
			})
			.join(',\n');
	};

	const hash1622398_1 = await api.rpc.chain.getBlockHash(1622398);
	const events1622398_1 = await api.query.system.events.at(hash1622398_1);
	console.log('Block 1622398, attempt 1');
	console.log(mapEvents(events1622398_1), '\n');

	const hash1 = await api.rpc.chain.getBlockHash(1);
	const events1 = await api.query.system.events.at(hash1);
	console.log('Block 1');
	console.log(mapEvents(events1), '\n');

	const hash1622398_2 = await api.rpc.chain.getBlockHash(1622398);
	const events1622398_2 = await api.query.system.events.at(hash1622398_2);
	console.log('Block 1622398, attempt 2');
	console.log(mapEvents(events1622398_2), '\n');

	process.exit();
}

main().catch(console.error);
