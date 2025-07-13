import view from './view.js'

class AddRecipeView extends view {
    _parentElement = document.querySelector(".add-recipe");
    #addRecipeForm = document.querySelector(".add-recipe-form");
    #addRecipeBtn = document.querySelector(".container .header .add-recipe-btn");
    #closeBtnElement = document.querySelector(".add-recipe .close-btn");
    #uploadBtnElement = document.querySelector(".add-recipe .upload-button");

    addClickEventToAddRecipeBtn(callbackFunc) {
        this.#addRecipeBtn.addEventListener("click", callbackFunc);
    }

    addClickEventToCloseBtn(callbackFunc) {
        this.#closeBtnElement.addEventListener("click", callbackFunc);
    }

    addClickEventToUploadBtn(callbackFunc) {
        this.#uploadBtnElement.addEventListener("click", function (e) {
            e.preventDefault();
            callbackFunc();
        });
    }

    getRecipeDataFromForm() {
        const formData = [...new FormData(this.#addRecipeForm)];//بياخد البيانات اللي بداخل عنصر ال form
        return Object.fromEntries(formData);
    }
}

export default new AddRecipeView();
