import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as recipeModel from "./modules/recipeModel"
import recipeView from "./views/recipeView.js"
import recipesListView from "./views/recipesListView"
import searchView from "./views/searchView.js"

async function loadRecipeDetailsByRecipeIdAsync(recipeId) {
    try {
        if (!recipeId) return;

        recipeView.hiddenErrorMessage();
        recipeView.hiddenRecipeStartMessage();
        recipeView.showRecipeLoadingGif();

        await recipeModel.fetchRecipeByIdAsync(recipeId);


        recipeView.renderRecipeDetails(recipeModel.state.recipe);
        recipeView.hiddenRecipeLoadingGif();
    } catch (error) {
        recipeView.hiddenRecipeLoadingGif();
        recipeView.showErrorMessage();
    }

}

async function loadRecipeDetailsFromHashAsync() {

    const recipeId = recipeView.getRecipeIdFromUrl()
    if (!recipeId) return;
    await loadRecipeDetailsByRecipeIdAsync(recipeId);

}

async function loadRecipesSearchResultsAsync() {
    try {

        //get search query
        const searchQuery = searchView.getSearchQuery();
        if (!searchQuery) return;

        searchView.clearTextInput();
        recipesListView.showLoading()

        //get results
        await recipeModel.fetchRecipesByNameAsync(searchQuery);

        //render results
        recipesListView.renderRecipesList(recipeModel.state.recipesSummaries);

        recipesListView.hiddenLoading();
        recipesListView.showRecipesListController();
    } catch (error) {
        recipesListView.hiddenLoading();
        console.log(`${error.message}😒`);
    }
}

async function onListItemClickAsync(e) {
    const recipeId = recipesListView.getRecipeIdFromRecipeListItem(e.target);
    if (!recipeId) return;

    recipeView.setUrlHashToRecipeId(recipeId);
}

// to handel events
function initial() {
    //windows events
    recipeView.handleWindowsLoadEvent(loadRecipeDetailsFromHashAsync).handleWindowsHashChangeEvent(loadRecipeDetailsFromHashAsync);

    //search events
    searchView.addSubmitEventToSearch(loadRecipesSearchResultsAsync);

    //recipe list events
    recipesListView.addClickEventToRecipeList(onListItemClickAsync);
}

initial();

// controlRecipeDetails();//"664c8f193e7aa067e94e8704"

// controlRecipesSearchResultsAsync();




