import View from "./view.js"
import * as helper from "./helper.js"

class BookmarksView extends View {
    _parentElement = document.querySelector(".container .header .bookmarks");
    #bookmarksBtnElement = document.querySelector(".container .header .bookmarks-btn");

    addClickEventToBookmarksBtn(callbackFunc) {
        this.#bookmarksBtnElement.addEventListener("click", callbackFunc);
    }

    hiddenBookmarks() {
        helper.addHiddenClassToElement(this._parentElement);
    }

    toggleShowBookmarks() {
        helper.toggleHiddenClassFromElement(this._parentElement);
    }

    _generateMarkup() {
        if (!this._data || !this._data.length >= 1) {
            return ` <div class="error-message">
                <i class="fa-regular fa-face-smile"></i>
                <p>
                    No bookmarks yet. Find a nice
                    recipe and bookmark it :)
                </p>
            </div>`
        }

        return `<ul class="recipes-list"> ` + this._data.map(recipe => {
            const activeClass = recipe.id === window.location.hash.slice(1) ? "active-list-item" : "";
            return ` <li class="recipe-item ${activeClass}" data-id="${recipe.id}">
                                <figure class="recipe-image">
                                    <img src="${recipe.imageUrl}" alt="${recipe.title}">
                                </figure>
                                <div class="recipe-info">
                                    <h3 class="recipe-title">
                                        ${recipe.title}
                                    </h3>
                                    <p class="recipe-author"> ${recipe.publisher}</p>
                                    <i class="fa-solid fa-user generate-by-user-ico hidden"></i>
                                </div>
                            </li>`
        }).join("") + `</ul>`;
    }

    getRecipeIdFromRecipeListItem(recipeListItem) {
        const recipeListItemEl = recipeListItem.closest(".recipe-item");

        return (recipeListItemEl) ? recipeListItemEl.dataset.id : null;
    }

    addClickEventToRecipeListItem(callbackFunc) {
        this._parentElement.addEventListener("click", function (e) {
            const recipeListItem = e.target.closest(".recipe-item");

            if (!recipeListItem) return;

            callbackFunc(e);
        });
    }


}

export default new BookmarksView();