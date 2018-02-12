import { Component, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import Holdings from '../../services/holdings';

@Component({
	tag: 'app-add-holding',
	styleUrl: 'app-add-holding.scss'
})
export class AppAddHolding {

	private holdingsService: Holdings = new Holdings();
	private cryptoUnavailable: boolean = false;
	private checkingValidity: boolean = false;
	private noConnection: boolean = false;
	private cryptoCode: string;
	private displayCurrency: string;
	private amountHolding: number;

	@Prop() history: RouterHistory;

	addHolding(){

		this.cryptoUnavailable = false;
		this.noConnection = false;
		this.checkingValidity = true;

		let holding = {
			crypto: this.cryptoCode,
			currency: this.displayCurrency,
			amount: this.amountHolding || 0
		};

		this.holdingsService.fetchPrice(holding).then((result) => {

			console.log(result);

			this.checkingValidity = false;

			if(result.success){
				this.holdingsService.addHolding(holding);
				this.history.goBack();
			} else {
				this.cryptoUnavailable = true;
			}

		}).catch((err) => {
			this.noConnection = true;
			this.checkingValidity = false;
		});

	}

	changeValue(ev){
		
		let value = ev.target.value;

		switch(ev.target.name){

			case 'cryptoCode': {
				this.cryptoCode = value;
				break;
			}

			case 'displayCurrency': {
				this.displayCurrency = value;
			}

			case 'amountHolding': {
				this.amountHolding = value;
			}

		}
	}

	render() { 
	
		return (
			<ion-page>
				<ion-header>
				  <ion-toolbar color="primary">
					<ion-buttons slot="start">
						<stencil-route-link url='/'>
							<ion-button>
								<ion-icon slot="icon-only" name="arrow-back"></ion-icon>
							</ion-button>
						</stencil-route-link>
					</ion-buttons>
				    <ion-title>Add Holding</ion-title>
				  </ion-toolbar>
				</ion-header>

				<ion-content>

					<div class="message">

						<p>To add a holding you will need to supply the appropriate symbol for the cryptocurrency, and the symbol for the currency you would like to display the values in.</p>

						<p><strong>Note:</strong> Listed prices are estimated. Rates may vary significantly across different exchanges.</p>

					</div>

					<ion-list>
				
						<ion-item>
							<ion-label stacked>Crypto Code</ion-label>
							<ion-input name="cryptoCode" onInput={(ev) => this.changeValue(ev)} placeholder="(e.g. BTC, LTC, ETH)" type="text"></ion-input>
						</ion-item>

						<ion-item>
							<ion-label stacked>Display Currency Code</ion-label>
							<ion-input onInput={(ev) => this.changeValue(ev)} name="displayCurrency" placeholder="(e.g. USD, CAD, AUD)" type="text"></ion-input>
						</ion-item>

						<ion-item>
							<ion-label stacked>Amount Holding</ion-label>
							<ion-input onInput={(ev) => this.changeValue(ev)} name="amountHolding" type="number"></ion-input>
						</ion-item>

					</ion-list>	

					<ion-button onClick={() => this.addHolding()}>Add Holding</ion-button>

				</ion-content>

				<ion-footer>

					<p><strong>Note:</strong> This web application allows you to track your Cryptocurrency without creating an account. This means that all data is stored locally, and may be permanently deleted without warning.</p>

				</ion-footer>
			</ion-page>
		);
	}

}