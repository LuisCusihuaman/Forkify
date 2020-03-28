import axios from "axios";

export default class Search {
	constructor(query) {
		this.query = query;
	}
	async getResults() {
		//old key = 13b636854a1030f7b75474d792b69850
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

			);
			this.result = res.data.recipes;
		} catch (error) {
			alert(error);
		}
	}
}
