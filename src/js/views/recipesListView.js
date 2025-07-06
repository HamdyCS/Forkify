import * as helper from "./helper"

class RecipesListView {

    #recipesSummaries;
    #recipesListContainerElement = document.querySelector(".recipes .recipe-list-container");
    #loadingGifElement = document.querySelector(".recipes .loading-gif");

    #recipesListElement = document.querySelector(".recipes .recipe-list-container .recipes-list");
    #recipesListControllerElement = document.querySelector(".recipes .recipe-list-container .recipes-list-controller");

    #previousBtnElement = document.querySelector(".recipes .recipe-list-container .previous");
    #nextBtnElement = document.querySelector(".recipes .recipe-list-container .next");
    #previousBtnPageNumberElement = document.querySelector(".recipes .recipe-list-container .previous .page-number ");
    #nextBtnPageNumberElement = document.querySelector(".recipes .recipe-list-container .previous .page-number ");

    renderRecipesList(recipesSummaries) {
        this.#recipesSummaries = recipesSummaries;
        this.#clearRecipesList();
        const recipesListItems = this.#generateRecipesList();
        this.#recipesListElement.insertAdjacentHTML("beforeend", recipesListItems);
    }

    #generateRecipesList() {
        return this.#recipesSummaries.map(recipeSummary => {
            return ` <li class="recipe-item" data-id="${recipeSummary.id}">
                                <figure class="recipe-image">
                                    <img src="${recipeSummary.imageUrl}" alt="${recipeSummary.title}">
                                </figure>
                                <div class="recipe-info">
                                    <h3 class="recipe-title">
                                        ${recipeSummary.title}
                                    </h3>
                                    <p class="recipe-author"> ${recipeSummary.publisher}</p>
                                    <i class="fa-solid fa-user generate-by-user-ico hidden"></i>
                                </div>
                            </li>`
        }).join("");
    }

    #clearRecipesList() {
        this.#recipesListElement.innerHTML = "";
    }

    showLoading() {
        helper.removeHiddenClassFromElement(this.#loadingGifElement);
    }

    hiddenLoading() {
        helper.addHiddenClassFromElement(this.#loadingGifElement);
    }

    showRecipesListController() {
        helper.removeHiddenClassFromElement(this.#recipesListControllerElement);
    }

    hiddenRecipesListController() {
        helper.addHiddenClassFromElement(this.#recipesListControllerElement);
    }

    togglePreviousBtn() {
        helper.toggleHiddenClassFromElement(this.#previousBtnElement);
    }

    toggleNextBtn() {
        helper.toggleHiddenClassFromElement(this.#nextBtnElement);
    }

    updatePreviousBtnPageNumberText(pageNumber) {
        this.#previousBtnPageNumberElement.textContent = pageNumber;
    }

    updateNextBtnPageNumberText(pageNumber) {
        this.#nextBtnPageNumberElement.textContent = pageNumber;
    }

    getRecipeIdFromRecipeListItem(element) {
        const recipeListItemEl = element.closest(".recipe-item");

        return (recipeListItemEl) ? recipeListItemEl.dataset.id : null;
    }

    addClickEventToRecipeList(callBackFunc) {
        this.#recipesListElement.addEventListener("click", callBackFunc);
    }
}

export default new RecipesListView();