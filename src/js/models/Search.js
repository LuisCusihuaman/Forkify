import axios from "axios";

export default class Search {
	constructor(query) {
		this.query = query;
	}
	async getResults() {
		//old key = 53ce5df515d9713c3e15280633a2dbe4
		const key = "9bc8c712edddf0e8f9d327b251f6be7b";
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
