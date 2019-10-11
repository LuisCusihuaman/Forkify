import axios from "axios";
import {key} from "../config";

export default class Search {
	constructor(query) {
		this.query = query;
	}
	async getResults() {
		//old key = 13b636854a1030f7b75474d792b69850
		try {
			const res = await axios(
				`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
			);
			this.result = res.data.recipes;
		} catch (error) {
			alert(error);
		}
	}
}
