import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as recipeModel from "./modules/recipeModel"
import recipeView from "./views/recipeView.js"


// async function renderRecipeByHashIdAsync(hashId) {
//     //to remove #
//     const recipeId = [...hashId].slice(1).join('');
//     if (!recipeId) return;
//
//     toggleHiddenClass(recipeDetailsLoadingGif);
//     toggleHiddenClass(recipeDetailsStartMessage);
//
//     const recipe = await fetchRecipeByIdAsync(recipeId);
//     if (!recipe) return;
//
//     renderRecipeDetails(recipe);
//     toggleHiddenClass(recipeDetailsLoadingGif);
// }

//windows events
// ["hashchange", "load"].forEach(eventName => {
//     window.addEventListener(eventName, async function (x) {
//         await renderRecipeByHashIdAsync(window.location.hash);
//     });
// })


async function controlRecipeDetails() {
    recipeView.hiddenRecipeStartMessage();
    recipeView.showRecipeLoadingGif();

    await recipeModel.fetchRecipeByIdAsync("664c8f193e7aa067e94e8704");

    if (!recipeModel.state.recipe) {
        recipeView.showRecipeStartMessage();
        recipeView.hiddenRecipeLoadingGif();
    }


    recipeView.renderRecipeDetails(recipeModel.state.recipe);
    recipeView.hiddenRecipeLoadingGif();
}

controlRecipeDetails();





