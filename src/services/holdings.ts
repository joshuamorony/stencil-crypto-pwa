import Storage from './storage';

interface Holding {
	crypto: string,
	currency: string,
	amount: number,
	value?: number
}

export default class Holdings {

	public storage: Storage = new Storage();

	constructor() {

	}

	addHolding(holding: Holding): void {

		this.storage.get('cryptoHoldings').then((holdings) => {

			if(holdings !== null){
				holdings.push(holding);
			} else {
				holdings = [holding];
			}

			this.storage.set('cryptoHoldings', holdings);

		});

	}

	removeHolding(holding): void {

		this.storage.get('cryptoHoldings').then((holdings) => {

			holdings.splice(holdings.indexOf(holding), 1);

			this.storage.set('cryptoHoldings', holdings);

		});

	}
	
	getHoldings(): Promise<any> {

		return new Promise((resolve, reject) => {

			this.storage.get('cryptoHoldings').then((holdings) => {

				if(holdings === null){
					resolve([]);
				} else {

					let requests = [];

					holdings.forEach((holding) => {
						let request = this.fetchPrice(holding);
						requests.push(request);
					});

					Promise.all(requests).then((results) => {

						console.log(results);

						holdings.map((holding, index) => {
							holding.value = results[index].ticker.price;
						});

						resolve(holdings);

					}).catch((err) => {
						reject(err);
					});

				}

			});

		});

	}

	fetchPrice(holding): Promise<any> {

		return fetch('https://api.cryptonator.com/api/ticker/' + holding.crypto + '-' + holding.currency).then((res) => res.json());

	}

}