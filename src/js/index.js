import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
/**Global stage of the app
    - Search object
    - Current recipe object
    - Shopping list object
    - Liked recipes 
*/

/**
 * SEARCH CONTROLLER
 */
const state = {};
const controlSearch = async () => {
	//1. Get query from View
	const query = searchView.getInput();
	if (query) {
		//2. New Search object and add to state
		state.search = new Search(query);
		console.log(state.search);
		//3. Prepare UI for results
		searchView.clearInput();
		searchView.clearResult();
		renderLoader(elements.searchRes);
		try {
			//4. Search for recipes
			await state.search.getResults();
			//5. Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);
		} catch (error) {
			alert("search wrong with search");
			clearLoader();
		}
	}
};

elements.searchForm.addEventListener("submit", e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
	const btn = e.target.closest(".btn-inline");
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResult();
		searchView.renderResults(state.search.result, goToPage);
	}
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
	//Get id from URL
	const id = window.location.hash.replace("#", "");

	if (id) {
		// Prepare UI for changes
		//	Create new recipe objects
		state.recipe = new Recipe(id);
		try {
			//	Get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
			//	Calculate serving and time
			state.recipe.calcTime();
			state.recipe.calcServings();
			//	Render recipe
			console.log(state.recipe);
		} catch (error) {
			alert("Error processing recipe");
		}
	}
};

const eventsRecipesListeners = ["hashchange", "load"];
eventsRecipesListeners.forEach(event =>
	window.addEventListener(event, controlRecipe)
);
