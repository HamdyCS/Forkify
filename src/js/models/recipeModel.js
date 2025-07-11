import "regenerator-runtime/runtime.js";
import config from "../config";
import {getJsonAsync, timeOut} from "./helper"

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
    recipe: null,
    recipes: null,
    recipesSummaries: null,
    currentPage: 1,

    resetState() {
        this.recipe = null;
        this.recipes = [];
        this.recipesSummaries = 0;
        this.currentPage = 0;
    }
};

function handelError(e) {
    throw e;
}


function mapFromRecipeJsonToRecipeObject(recipeJson) {

    try {
        const recipeObject = recipeJson;

        const ingredients = recipeJson.ingredients.map(x => new Ingredient(x.description, x.quantity, x.unit));

        return new Recipe(recipeObject.publisher, ingredients, recipeObject.source_url,
            recipeObject.image_url, recipeObject.title, recipeObject.servings, recipeObject.cooking_time, recipeObject.id);


    } catch (error) {
        handelError(error);
    }

}

function mapFromRecipeSummaryJsonToRecipeSummaryObject(recipeSummaryJson) {
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


        state.recipesSummaries = recipesJson.data.recipes.map(x => mapFromRecipeSummaryJsonToRecipeSummaryObject(x));


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


        state.recipe = mapFromRecipeJsonToRecipeObject(recipeJson.data.recipe);

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
