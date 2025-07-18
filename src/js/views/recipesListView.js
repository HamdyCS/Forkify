import * as helper from "./helper"


class RecipesListView {

    #recipesSummaries;
    #recipesListContainerElement = document.querySelector(".recipes .recipe-list-container");

    #errorMessage = document.querySelector(".recipes .recipe-list-container .error-message");
    #loadingGifElement = document.querySelector(".recipes .loading-gif");

    #recipesListElement = document.querySelector(".recipes .recipe-list-container .recipes-list");


    renderRecipesList(recipesSummaries) {
        this.#recipesSummaries = recipesSummaries;
        this.#clearRecipesList();
        const recipesListItems = this.#generateRecipesList();
        this.#recipesListElement.insertAdjacentHTML("beforeend", recipesListItems);
    }

    #generateRecipesList() {
        if (!this.#recipesSummaries) return null;

        return this.#recipesSummaries.map(recipeSummary => {

            const activeClass = recipeSummary.id === window.location.hash.slice(1) ? "active-list-item" : "";
            return ` <li class="recipe-item ${activeClass}" data-id="${recipeSummary.id}">
                                <figure class="recipe-image">
                                    <img src="${recipeSummary.imageUrl}" alt="${recipeSummary.title}">
                                </figure>
                                <div class="recipe-info">
                                    <h3 class="recipe-title">
                                        ${recipeSummary.title}
                                    </h3>
                                    <p class="recipe-author"> ${recipeSummary.publisher}</p>
                                    ${recipeSummary.key ? ` <i class="fa-solid fa-user generate-by-user-ico "></i>` : ''}
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
        helper.addHiddenClassToElement(this.#loadingGifElement);
    }

    getRecipeIdFromRecipeListItem(element) {
        const recipeListItemEl = element.closest(".recipe-item");

        return (recipeListItemEl) ? recipeListItemEl.dataset.id : null;
    }

    addClickEventToRecipeList(callBackFunc) {
        this.#recipesListElement.addEventListener("click", callBackFunc);
    }

    showErrorMessage() {
        helper.removeHiddenClassFromElement(this.#errorMessage);
    }

    hiddenErrorMessage() {
        helper.addHiddenClassToElement(this.#errorMessage);
    }

    update() {

        const newMarkup = this.#generateRecipesList();
        if (!newMarkup) return;

        //convert string to dom (virtual dom)
        const newDom = document.createRange().createContextualFragment(newMarkup);

        //get all new elements
        const newElements = [...newDom.querySelectorAll("*")];

        //get all current elements
        const currentElements = [...this.#recipesListElement.querySelectorAll("*")];

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
}

export default new RecipesListView();