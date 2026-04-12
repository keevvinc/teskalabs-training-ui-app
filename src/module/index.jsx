import { Module } from "asab_webui_components";

import { TableScreen } from './TableScreen.jsx';
import { DetailScreen } from './DetailScreen.jsx';
import { BreedsScreen } from './BreedsScreen.jsx';

export default class TableApplicationModule extends Module {
	constructor(app, name) {
		super(app, "TableApplicationModule");

		app.Router.addRoute({
			path: "/",
			end: false,
			name: 'Table',
			component: TableScreen,
		});

		app.Navigation.addItem({
			name: "Table",
			icon: 'bi bi-table',
			url: "/",
		});

		app.Router.addRoute({
			path: "/detail/:id",
			end: true,
			name: 'Detail',
			component: DetailScreen,
		});

		app.Router.addRoute({
			path: "/breeds",
			end: true,
			name: 'Breeds',
			component: BreedsScreen,
		});

		app.Navigation.addItem({
			name: "Breeds",
			icon: 'bi bi-heart',
			url: "/breeds",
		});
	}
}
