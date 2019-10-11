import axios from "axios";
import { key } from "../config";

export default class Recipe {
	constructor(id) {
		this.id = id;
	}
	async getRecipe() {
		try {
			const result = await axios(
				`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
			);
			this.title = result.data.recipe.title;
			this.author = result.data.recipe.publisher;
			this.img = result.data.recipe.image_url;
			this.url = result.data.recipe.source_url;
			this.ingredients = result.data.recipe.ingredients;
		} catch (error) {
			console.log(error);
			alert("Something went wrong");
		}
	}
	calcTime() {
		//Asuming tath we need 15 min for each 3 ingredients
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}
	calcServings() {
		this.servings = 4;
	}
	parseIngredients() {
		const unitsLong = [
			"tablespoons",
			"tablespoon",
			"ounces",
			"ounce",
			"teaspoons",
			"teaspoon",
			"cups",
			"pounds"
		];
		const unitsShort = [
			"tbsp",
			"tbsp",
			"oz",
			"oz",
			"tsp",
			"tsp",
			"cup",
			"pound"
		];
		const units = [...unitsShort, "kg", "g"];
		const createIngredientIfUnit = (arrIng, unitIndex) => {
			const arrCount = arrIng.slice(0, unitIndex);
			let count;
			if (arrCount.length === 1) {
				count = eval(arrIng[0].replace("-", "+"));
			} else {
				count = eval(arrIng.slice(0, unitIndex).join("+"));
			}
			return {
				count,
				unit: arrIng[unitIndex],
				ingredient: arrIng.slice(unitIndex + 1).join(" ")
			};
		};
		const createIngredientByUnit = (unitIndex, arrIng, ingredient) => {
			if (unitIndex > -1) {
				// There is a unit
				// Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
				// Ex. 4 cups, arrCount is [4]
				return createIngredientIfUnit(arrIng, unitIndex);
			} else if (parseInt(arrIng[0], 10)) {
				// There is NO unit, but 1st element is number
				return {
					count: parseInt(arrIng[0], 10),
					unit: "",
					ingredient: arrIng.slice(1).join(" ")
				};
			} else if (unitIndex === -1) {
				// There is NO unit and NO number in 1st position
				return {
					count: 1,
					unit: "",
					ingredient
				};
			}
		};
		const removeContentParentheses = ingredient => {
			return ingredient.replace(/ *\([^)]*\) */g, " ");
		};
		const newIngredients = this.ingredients.map(element => {
			// 1) Uniform units
			let ingredient = element.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);
			});
			ingredient = removeContentParentheses(ingredient);
			// 2) Parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(" ");
			const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
			let objIng = createIngredientByUnit(unitIndex, arrIng, ingredient);
			return objIng;
		});
		this.ingredients = newIngredients;
	}
}
