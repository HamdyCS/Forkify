import "regenerator-runtime/runtime.js";
import config from "../config";
import {getJsonAsync, timeOut, getItemFromLocalStorage, addItemToLocalStorage, generateRandomId} from "./helper"

class Ingredient {
    description;
    quantity;
    unit;

    constructor(description, quantity, unit) {
        this.description = description;
        this.quantity = quantity;
        this.unit = unit;
    }
}

class Recipe {
    publisher;
    ingredients = [];
    sourceUrl;
    imageUrl;
    title;
    servings;
    cookingTime;
    id;
    isBookMarked = false;

    constructor(publisher, ingredients, sourceUrl, imageUrl, title, servings, cookingTime, id) {
        this.publisher = publisher;
        this.ingredients = ingredients;
        this.sourceUrl = sourceUrl;
        this.imageUrl = imageUrl;
        this.title = title;
        this.servings = servings;
        this.cookingTime = cookingTime;
        this.id = id;
    }
}

class RecipeSummary {
    id;
    imageUrl;
    publisher;
    title;

    constructor(id, imageUrl, publisher, title) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.publisher = publisher;
        this.title = title;
    }
}

export const state = {
    recipe: {},
    recipes: [],
    recipesSummaries: [],
    currentPage: 1,
    bookMarks: [],// array of recipes
};

function handelError(e) {
    throw e;
}

function mapFromRecipeApiJsonToRecipe(recipeJson) {

    try {
        const recipeObject = recipeJson;

        const ingredients = recipeJson.ingredients.map(x => new Ingredient(x.description, x.quantity, x.unit));

        const recipe = new Recipe(recipeObject.publisher, ingredients, recipeObject.source_url,
            recipeObject.image_url, recipeObject.title, recipeObject.servings, recipeObject.cooking_time, recipeObject.id);

        recipe.isBookMarked = isRecipeBookMarkedByRecipeId(recipe.id);

        return recipe;

    } catch (error) {
        handelError(error);
    }

}

function mapFromRecipeSummaryJsonToRecipeSummary(recipeSummaryJson) {
    try {
        return new RecipeSummary(recipeSummaryJson.id, recipeSummaryJson.image_url, recipeSummaryJson.publisher, recipeSummaryJson.title);
    } catch (error) {
        handelError(error);
    }
}

export async function fetchRecipesByNameAsync(name) {

    try {
        if (!name) throw new Error('Name is null or empty');

        const recipesJson = await Promise.race([getJsonAsync(`${config.API_URL}?search=${name}&key=${config.API_KEY}`), timeOut(config.TIMEOUT_SECONDS)]);


        state.recipesSummaries = recipesJson.data.recipes.map(x => mapFromRecipeSummaryJsonToRecipeSummary(x));


        //fake data
        // await Promise.resolve();
        //
        // state.recipesSummaries = [];
        // for (let i = 1; i < 65; i++) {
        //     state.recipesSummaries.push(new RecipeSummary(1, "", "Hamdy khaled mohammed", i.toString()));
        //
        // }
    } catch (e) {
        handelError(e);
    }

}

export async function fetchRecipeByIdAsync(Id) {

    try {
        if (!Id) throw Error("Id is null or empty")

        const recipeJson = await Promise.race([
            getJsonAsync(`${config.API_URL}/${Id}?key=${config.API_KEY}`),
            timeOut(config.TIMEOUT_SECONDS)
        ]);


        state.recipe = mapFromRecipeApiJsonToRecipe(recipeJson.data.recipe);


    } catch (e) {
        handelError(e);
    }
}

export function updateServings(NewNumberOfServings) {

    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = ingredient.quantity / state.recipe.servings * NewNumberOfServings;
    });

    state.recipe.servings = NewNumberOfServings;

}

export function isRecipeBookMarkedByRecipeId(recipeId) {
    return state.bookMarks.some(recipe => recipe.id === recipeId);
}

function addNewBookMark(recipe) {
    state.bookMarks.push(recipe);
}

function removeBookMarkByRecipeId(recipeId) {
    const bookMarkIndex = state.bookMarks.findIndex(x => x.id === recipeId);
    state.bookMarks.splice(bookMarkIndex, 1);
}

export function switchBookMarkState(recipe) {

    const bookMarkIndex = state.bookMarks.findIndex(x => x.id === recipe.id);

    if (bookMarkIndex === -1) {
        addNewBookMark(recipe);
        recipe.isBookMarked = true;
        return;
    }

    removeBookMarkByRecipeId(recipe.id);
    recipe.isBookMarked = false;
}

export function addBookMarksToLocalStorage(bookMarks) {
    addItemToLocalStorage("bookMarks", bookMarks);
}

function mapFromRecipeObjectToRecipe(recipeObject) {
    if (!recipeObject) return;

    const ingredients = recipeObject.ingredients.map(x => new Ingredient(x.description, x.quantity, x.unit));

    const recipe = new Recipe(recipeObject.publisher, ingredients, recipeObject.sourceUrl,
        recipeObject.imageUrl, recipeObject.title, recipeObject.servings, recipeObject.cookingTime, recipeObject.id);

    recipe.isBookMarked = isRecipeBookMarkedByRecipeId(recipe.id);

    return recipe;
}

export function getBookMarksFromLocalStorage(bookMarks) {
    const bookmarks = getItemFromLocalStorage("bookMarks");

    return bookmarks.map(bookmark => mapFromRecipeObjectToRecipe(bookmark));
}

export function mapFromRecipeDataFromFormToRecipe(recipeDataForm) {

    // {
    //     "title": "TEST23",
    //     "url": "TEST23",
    //     "image_url": "TEST23",
    //     "publisher": "Hamdy",
    //     "prep_time": "23",
    //     "servings": "23",
    //     "ingredient1": "0.5,kg,Rice",
    //     "ingredient2": "1,,Avocado",
    //     "ingredient3": ", ,salt",
    //     "ingredient4": "",
    //     "ingredient5": "",
    //     "ingredient6": ""
    // }

    //'Quantity,Unit,Description'

    // recipeJson.ingredients.map(x => new Ingredient(x.description, x.quantity, x.unit));
    const ingredients = Object.entries(recipeDataForm).filter(pair => pair[0].includes("ingredient")).map(pair => {
        const ingredientInfoArr = pair[1].split(',');
        //
        // constructor(description, quantity, unit) {
        //     this.description = description;
        //     this.quantity = quantity;
        //     this.unit = unit;
        // }
        return new Ingredient(ingredientInfoArr[2], ingredientInfoArr[0], ingredientInfoArr[1]);
    });

    return new Recipe(recipeDataForm.publisher, ingredients, recipeDataForm.url,
        recipeDataForm.image_url, recipeDataForm.title, recipeDataForm.servings, recipeDataForm.prep_time, generateRandomId());

}
