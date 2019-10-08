import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
/**Global stage of the app
    - Search object
    - Current recipe object
    - Shopping list object
    - Liked recipes 
*/

const state = {};
const controlSearch = async () => {
	//1. Get query from View
	const query = searchView.getInput();
	if (query) {
		//2. New Search object and add to state
		state.search = new Search(query);
		//3. Prepare UI for results
		searchView.clearInput();
		searchView.clearResult();
		renderLoader(elements.searchRes);
		//4. Search for recipes
		await state.search.getResults();
		//5. Render results on UI
		clearLoader();
		searchView.renderResults(state.search.result);
	}
};

elements.searchForm.addEventListener("submit", e => {
	e.preventDefault();
	controlSearch();
});
