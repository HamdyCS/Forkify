import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as recipeModel from "../models/recipeModel.js"
import recipeView from "../views/recipeView.js"
import recipesListView from "../views/recipesListView"
import searchView from "../views/searchView.js"
import paginationView from "../views/paginationView.js"
import bookmarksView from "../views/bookmarksView.js"
import documentView from "../views/documentView.js"
import addRecipeView from "../views/addRecipeView.js"
import * as helper from "./helper.js"
import config from "../config.js"
import {state} from "../models/recipeModel.js";


let numberOfPages = 0;


if (module.hot) {
    module.hot.accept();
}

function resetPagination() {
    numberOfPages = 0;
    recipeModel.state.currentPage = 1;

    paginationView.hiddenPagination();

    paginationView.updatePreviousBtnVisibility(false);
    paginationView.updateNextBtnShowVisibility(false);

    paginationView.updatePreviousBtnPageNumberText(0);
    paginationView.updateNextBtnPageNumberText(0);

}

function controlPagination(lengthOfRecipesSummaries) {
    paginationView.showPagination();
    numberOfPages = helper.getNumberOfPages(lengthOfRecipesSummaries, config.NUMBER_OF_ROWS_IN_PAGE);

    if (numberOfPages === 1) {
        paginationView.hiddenPagination();
        return;
    }

    paginationView.updateNextBtnShowVisibility(true);
    paginationView.updatePreviousBtnVisibility(false);
    paginationView.updateNextBtnPageNumberText(2);
}

function updatePagination() {

    if (recipeModel.state.currentPage === 1) {
        paginationView.updateNextBtnShowVisibility(true);
        paginationView.updatePreviousBtnVisibility(false);

        paginationView.updateNextBtnPageNumberText(recipeModel.state.currentPage + 1);
        return;
    }

    if (recipeModel.state.currentPage === numberOfPages) {
        paginationView.updateNextBtnShowVisibility(false);
        paginationView.updatePreviousBtnVisibility(true);

        paginationView.updatePreviousBtnPageNumberText(recipeModel.state.currentPage - 1);
        return;
    }

    paginationView.updateNextBtnShowVisibility(true);
    paginationView.updatePreviousBtnVisibility(true);

    paginationView.updateNextBtnPageNumberText(recipeModel.state.currentPage + 1);
    paginationView.updatePreviousBtnPageNumberText(recipeModel.state.currentPage - 1);
}

async function loadRecipeDetailsByRecipeIdAsync(recipeId) {
    try {
        if (!recipeId) return;

        recipesListView.update();
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
    //get bookmarks from local storage
    recipeModel.state.bookMarks = recipeModel.getBookMarksFromLocalStorage();

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
        recipesListView.hiddenErrorMessage();
        recipesListView.showLoading();

        resetPagination();
        //get results
        await recipeModel.fetchRecipesByNameAsync(searchQuery);

        if (!recipeModel.state.recipesSummaries.some(x => x)) throw new Error('not found any recipe!');

        //render results
        recipesListView.renderRecipesList(recipeModel.state.recipesSummaries.slice(0, config.NUMBER_OF_ROWS_IN_PAGE));

        recipesListView.hiddenLoading();


        controlPagination(recipeModel.state.recipesSummaries.length);

    } catch (error) {
        recipesListView.hiddenLoading();
        recipesListView.showErrorMessage();
    }
}

async function onListItemClickAsync(e) {
    const recipeId = recipesListView.getRecipeIdFromRecipeListItem(e.target);
    if (!recipeId) return;

    recipeView.setUrlHashToRecipeId(recipeId);
}

function onPaginationPreviousBtnClick() {
    //2=> click on 1 => 1 10
    recipeModel.state.currentPage -= 1;
    const startIndex = (recipeModel.state.currentPage - 1) * config.NUMBER_OF_ROWS_IN_PAGE;
    const endIndex = startIndex + config.NUMBER_OF_ROWS_IN_PAGE;
    recipesListView.renderRecipesList(recipeModel.state.recipesSummaries.slice(startIndex, endIndex));
    updatePagination();
}

function onPaginationNextBtnClick() {
    //1 => click on 2 => 10 : 20
    const startIndex = (recipeModel.state.currentPage) * config.NUMBER_OF_ROWS_IN_PAGE;
    const endIndex = startIndex + config.NUMBER_OF_ROWS_IN_PAGE;
    recipeModel.state.currentPage += 1;
    recipesListView.renderRecipesList(recipeModel.state.recipesSummaries.slice(startIndex, endIndex));
    updatePagination();
}

function onServingsIncreaseBtnClick() {

    recipeModel.updateServings(recipeModel.state.recipe.servings + 1);
    recipeView.update(recipeModel.state.recipe);
}

function onServingsDecreaseBtnClick() {

    if (recipeModel.state.recipe.servings === 1)
        return;

    recipeModel.updateServings(recipeModel.state.recipe.servings - 1);
    recipeView.update(recipeModel.state.recipe);
}

function onBookmarkBtnClick() {
    // const recipeId = recipeView.getRecipeIdFromUrl();
    // if (!recipeId) return;

    recipeModel.switchBookMarkState(recipeModel.state.recipe);
    recipeView.update(recipeModel.state.recipe);

    //update bookmarks in local storage
    recipeModel.addBookMarksToLocalStorage();
}

function onBookmarksBtnCLick() {

    bookmarksView.toggleShowBookmarks();
    bookmarksView.render(recipeModel.state.bookMarks);
}

function onBookmarksRecipeListItemClick(e) {
    const recipeId = bookmarksView.getRecipeIdFromRecipeListItem(e.target);

    if (!recipeId) return;

    recipeView.setUrlHashToRecipeId(recipeId);

    loadRecipeDetailsByRecipeIdAsync(recipeId);

    bookmarksView.toggleShowBookmarks();
}

function onDocumentEscapeClick() {
    bookmarksView.hiddenBookmarks();
    addRecipeView.hidden();
    documentView.hiddenOverlay();
}

function onAddRecipeBtnClick() {

    documentView.showOverlay();
    addRecipeView.show();
}

function onCloseAddRecipeModalClick() {
    addRecipeView.hiddenMessage();
    addRecipeView.hidden();
    documentView.hiddenOverlay();
}

async function onUploadBtnClick() {

    try {
        const recipeDataFromForm = addRecipeView.getRecipeDataFromForm();
        const recipe = recipeModel.mapFromRecipeDataFromFormToRecipe(recipeDataFromForm);

        addRecipeView.showLoadingGif();
        await recipeModel.addNewRecipeAsync(recipe);

        recipeView.setUrlHashToRecipeIdWithOutReloadPage(state.recipe.id)

        recipeView.hiddenRecipeStartMessage();
        recipeView.renderRecipeDetails(recipeModel.state.recipe);

        addRecipeView.hiddenLoadingGif();
        addRecipeView.showMessage("😍 Uploaded new recipe Successfully!");

    } catch (e) {
        addRecipeView.hiddenLoadingGif();
        addRecipeView.showMessage(`❌ ${e.message}`);
    }
}

function onOverlayClick() {
    onCloseAddRecipeModalClick();
}

function onDirectionsBtnClick() {
    window.open(recipeModel.state.recipe.sourceUrl, "_blank");
}

// to handel events
function initial() {

    //windows events
    recipeView.handleWindowsLoadEvent(loadRecipeDetailsFromHashAsync).handleWindowsHashChangeEvent(loadRecipeDetailsFromHashAsync);

    //search events
    searchView.addSubmitEventToSearch(loadRecipesSearchResultsAsync);

    //recipe list events
    recipesListView.addClickEventToRecipeList(onListItemClickAsync);

    //pagination btns
    paginationView.addClickEventsToPreviousBtn(onPaginationPreviousBtnClick);
    paginationView.addClickEventsToNextBtn(onPaginationNextBtnClick);

    //servings btns
    recipeView.addClickEventToIncreaseServingsBtn(onServingsIncreaseBtnClick);
    recipeView.addClickEventToDecreaseServingsBtn(onServingsDecreaseBtnClick);

    //bookmark Btn in recipe details
    recipeView.addClickEventToBookMarkBtn(onBookmarkBtnClick);

    //bookmarks btn in header
    bookmarksView.addClickEventToBookmarksBtn(onBookmarksBtnCLick);

    //add recipe btn
    addRecipeView.addClickEventToAddRecipeBtn(onAddRecipeBtnClick);

    //bookmarks recipe list item
    bookmarksView.addClickEventToRecipeListItem(onBookmarksRecipeListItemClick);


    //document
    documentView.addEscapeClickEventToDocument(onDocumentEscapeClick);

    //close recipe modal
    addRecipeView.addClickEventToCloseBtn(onCloseAddRecipeModalClick);

    //upload recipe btn
    addRecipeView.addClickEventToUploadBtn(onUploadBtnClick);

    //overlay
    documentView.addClickEventToOverlay(onOverlayClick);

    //directions btn
    recipeView.addClickEventToDirectionsBtn(onDirectionsBtnClick);
    
}

initial();

// controlRecipeDetails();//"664c8f193e7aa067e94e8704"

// controlRecipesSearchResultsAsync();




