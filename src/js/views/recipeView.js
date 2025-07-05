import Fraction from 'fraction.js';

class RecipeView {
    #recipe;
    #recipeDetails = document.querySelector(".recipes .recipe .recipe-details");
    #recipeLoadingGif = document.querySelector(".recipes .recipe .loading-gif")
    #recipeStartMessage = document.querySelector(".recipes .recipe .start-message");

    #toggleHiddenClass(domElement) {
        domElement.classList.toggle("hidden")
    }
    
    hiddenRecipeStartMessage() {
        this.#recipeStartMessage.classList.add("hidden");
    }

    showRecipeStartMessage() {
        this.#recipeStartMessage.classList.remove("hidden");
    }

    showRecipeLoadingGif() {
        this.#recipeLoadingGif.classList.remove("hidden");
    }

    hiddenRecipeLoadingGif() {
        this.#recipeLoadingGif.classList.add("hidden");
    }

    renderRecipeDetails(recipe) {
        this.#recipe = recipe;
        const recipeDetails = this.#generateRecipeDetails();
        this.#clearRecipeDetails();
        this.#recipeDetails.insertAdjacentHTML("afterbegin", recipeDetails);
    }

    #generateRecipeDetails() {

        const recipeIngredientsListItems = this.#recipe.ingredients.reduce((acc, cur) => {
            //&nbsp to make space
            const quantity = cur.quantity ? `${new Fraction(cur.quantity).toFraction().toString()}&nbsp` : "";
            const unit = cur.unit ? `${cur.unit}&nbsp` : "";
            const description = cur.description ? `${cur.description}&nbsp` : "";

            return acc += `<li>
    <span class="quantity">${quantity} </span> 
    <span class="unit">${unit}</span> 
    <span class="description">${description}</span>
  </li>`;
        }, "");


        return ` <figure class="recipe-preview">
                <img src="${this.#recipe.imageUrl}" alt="${this.#recipe.title}">
                <h2 class="title">
                    ${this.#recipe.title}
                </h2>
            </figure>
            <div class="recipe-info">
                <div class="minutes"><i class="fa-solid fa-clock"></i> <span class="number-of-minutes">${this.#recipe.cookingTime}</span>
                    MINUTES
                </div>
                <div class="servings"><i class="fa-solid fa-user"></i> <span class="number-of-servings">${this.#recipe.servings}</span>
                    SERVINGS
                    <i class="fa-solid fa-minus servings-increase hover-scale-transform"></i>
                    <i class="fa-solid fa-plus servings-decrease hover-scale-transform"></i>
                </div>
                <button class="bookmark-btn hover-scale-transform">
                    <i class="fa-regular fa-bookmark"></i>
                </button>
            </div>
            <div class="ingredients">
                <h3>RECIPE INGREDIENTS</h3>
                <ul>
                    ${recipeIngredientsListItems}
                </ul>
            </div>
            <div class="how-to-cook-recipe">
                <h3>
                    How to cook it
                </h3>
                <p class="recipe-description">
                    This recipe was carefully designed and tested by <span class="publisher-by">${this.#recipe.publisher}</span>.
                    Please check out
                    directions at their
                    website.
                </p>

                <button class="directions-btn hover-scale-transform">
                    Directions
                </button>
            </div>`


    }

    #clearRecipeDetails() {
        this.#recipeDetails.innerHTML = "";
    }
}

export default new RecipeView();