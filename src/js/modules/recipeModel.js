import "regenerator-runtime/runtime.js";

const forkifyApi = "https://forkify-api.jonas.io/api/v2/recipes";
const forkifyApiKey = "0b8614e2-ee29-4df5-8461-9584cd583f89";

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
};

function handelError(e) {
    console.error(`Error: ${e.message} 😒`);
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
    if (!name) return null;

    try {
        const recipesResponse = await fetch(`${forkifyApi}?search=${name}&key=${forkifyApiKey}`);


        if (!recipesResponse.ok) throw new Error(`${recipesResponse.message}. statues code: ${recipesResponse.status}`);

        const recipesJson = await recipesResponse.json();

        console.log(recipesJson.data.recipes);

        state.recipesSummaries = recipesJson.data.recipes.map(x => mapFromRecipeSummaryJsonToRecipeSummaryObject(x));


    } catch (e) {
        handelError(e);
    }

}

export async function fetchRecipeByIdAsync(Id) {
    if (!Id) return null;

    try {
        const recipeResponse = await fetch(`${forkifyApi}/${Id}?key=${forkifyApiKey}`);

        if (!recipeResponse.ok) throw new Error(`${recipeResponse.message}. statues code: ${recipeResponse.status}`);

        const recipeJson = await recipeResponse.json();
        state.recipe = mapFromRecipeJsonToRecipeObject(recipeJson.data.recipe);


    } catch (e) {
        handelError(e);

    }
}
