import Fraction from 'fraction.js';
import * as helper from './helper';
import {addHiddenClassToElement, removeHiddenClassFromElement} from "./helper";

class RecipeView {
    #recipe;
    #recipeDetails = document.querySelector(".recipes .recipe .recipe-details");
    #recipeLoadingGif = document.querySelector(".recipes .recipe > .loading-gif");
    #recipeStartMessage = document.querySelector(".recipes .recipe > .start-message");
    #errorMessage = document.querySelector(".recipes .recipe > .error-message");


    hiddenRecipeStartMessage() {
        helper.addHiddenClassToElement(this.#recipeStartMessage);
        return this;
    }

    showRecipeStartMessage() {
        helper.removeHiddenClassFromElement(this.#recipeStartMessage);
        return this;
    }

    showRecipeLoadingGif() {
        helper.removeHiddenClassFromElement(this.#recipeLoadingGif);
        return this;
    }

    hiddenRecipeLoadingGif() {
        helper.addHiddenClassToElement(this.#recipeLoadingGif);
        return this;
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


        const activeBookmarkClass = this.#recipe.isBookMarked ? "active-bookmark-btn" : "";

        return ` <figure class="recipe-preview">
                <img src="${this.#recipe.imageUrl}" alt="${this.#recipe.title}">
                <h2 class="title">
                    ${this.#recipe.title}
                </h2>
            </figure>
            <div class="recipe-description">
            <div class="recipe-info">
                <div class="minutes"><i class="fa-solid fa-clock"></i> <span class="number-of-minutes">${this.#recipe.cookingTime}</span>
                    MINUTES
                </div>
                <div class="servings"><i class="fa-solid fa-users"></i> <span class="number-of-servings">${this.#recipe.servings}</span>
                    SERVINGS
                    <i class="fa-solid fa-minus servings-decrease hover-scale-transform"></i>
                    <i class="fa-solid fa-plus servings-increase hover-scale-transform"></i>
                </div>
                ${this.#recipe.key ? ` <i class="fa-solid fa-user generate-by-user-ico "></i> ` : ''}
                <button class="bookmark-btn hover-scale-transform ${activeBookmarkClass}">
                    <i class="fa-regular fa-bookmark "></i>
                </button>
            </div>
            <div class="ingredients">
                <h3>RECIPE INGREDIENTS</h3>
                <ul>
                    ${recipeIngredientsListItems}
                </ul>
            </div>
</div>
            
            <div class="how-to-cook-recipe">
                <h3>
                    How to cook it
                </h3>
                <p class="recipe-publisher">
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

    handleWindowsLoadEvent(callbackFunc) {
        window.addEventListener('load', callbackFunc);
        return this;
    }

    handleWindowsHashChangeEvent(callbackFunc) {
        window.addEventListener('hashchange', callbackFunc);
        return this;
    }

    showErrorMessage() {
        helper.removeHiddenClassFromElement(this.#errorMessage);
    }

    hiddenErrorMessage() {
        helper.addHiddenClassToElement(this.#errorMessage);
    }

    getRecipeIdFromUrl() {
        return window.location.hash.slice(1);
    }

    setUrlHashToRecipeId(recipeId) {
        window.location.hash = recipeId;
    }

    setUrlHashToRecipeIdWithOutReloadPage(recipeId) {
        //change url id بدون عمل تحميل للصفحة
        window.history.pushState(null, "", `#${recipeId}`);
    }

    addClickEventToIncreaseServingsBtn(callBackFunc) {
        this.#recipeDetails.addEventListener("click", (e) => {
            const increaseServingsBtn = e.target.closest(".servings-increase");

            if (!increaseServingsBtn)
                return;

            callBackFunc(e);
        })
    }

    addClickEventToDecreaseServingsBtn(callBackFunc) {
        this.#recipeDetails.addEventListener("click", (e) => {
            const decreaseServingsBtn = e.target.closest(".servings-decrease");

            if (!decreaseServingsBtn)
                return;

            callBackFunc();
        })
    }

    addClickEventToBookMarkBtn(callBackFunc) {
        this.#recipeDetails.addEventListener("click", (e) => {

            const bookMarkBtn = e.target.closest(".bookmark-btn");

            if (!bookMarkBtn)
                return;

            callBackFunc();
        })
    }

    update(NewRecipe) {
        // this.renderRecipeDetails(NewRecipe);

        this.#recipe = NewRecipe;

        const newMarkup = this.#generateRecipeDetails();

        //convert string to dom (virtual dom)
        const newDom = document.createRange().createContextualFragment(newMarkup);

        //get all new elements
        const newElements = [...newDom.querySelectorAll("*")];

        //get all current elements
        const currentElements = [...this.#recipeDetails.querySelectorAll("*")];

        // console.log(currentElements);
        // console.log(newElements);

        newElements.forEach((newElement, i) => {
            const currentElement = currentElements[i];

            // لو أحد العناصر مش موجود لأي سبب، تجاهل
            if (!newElement || !currentElement) return;

            // لو متطابقين تمامًا، تجاهل
            if (newElement.isEqualNode(currentElement)) return;

            // ✅ 1) تحديث النص داخل TextNode فقط
            const newChildren = [...newElement.childNodes];
            const currentChildren = [...currentElement.childNodes];

            newChildren.forEach((child, index) => {
                if (
                    child.nodeType === Node.TEXT_NODE &&
                    child.nodeValue.trim() !== "" &&
                    child.nodeValue !== currentChildren[index]?.nodeValue
                ) {
                    currentChildren[index].nodeValue = child.nodeValue;
                }
            });

            // ✅ 2) تحديث الـ Attributes
            [...newElement.attributes].forEach(attr => {
                if (currentElement.getAttribute(attr.name) !== attr.value) {
                    currentElement.setAttribute(attr.name, attr.value);
                }
            });

            // ✅ 3) حذف أي Attribute لم يعد موجودًا
            [...currentElement.attributes].forEach(attr => {
                if (!newElement.hasAttribute(attr.name)) {
                    currentElement.removeAttribute(attr.name);
                }
            });
        });
    }

    addClickEventToDirectionsBtn(callbackFunc) {
        this.#recipeDetails.addEventListener("click", (e) => {
            const directionsBtn = e.target.closest(".directions-btn");

            if (!directionsBtn)
                return;

            callbackFunc();
        })
    }
}

export default new RecipeView();