import view from './view.js'
import * as helper from './helper';

class AddRecipeView extends view {
    _parentElement = document.querySelector(".add-recipe");
    #addRecipeForm = document.querySelector(".add-recipe-form");
    #addRecipeBtn = document.querySelector(".container .header .add-recipe-btn");
    #closeBtnElement = document.querySelector(".add-recipe .close-btn");
    #uploadBtnElement = document.querySelector(".add-recipe .upload-button");
    #errorMessageElement = document.querySelector(".add-recipe .add-recipe-form .error-message");
    #loadingGif = document.querySelector(".add-recipe .add-recipe-form .loading-gif");

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

    showMessage(message = "") {
        this.#errorMessageElement.innerText = message;
        helper.removeHiddenClassFromElement(this.#errorMessageElement);
    }

    hiddenMessage() {
        helper.addHiddenClassToElement(this.#errorMessageElement);
    }

    showLoadingGif() {
        helper.removeHiddenClassFromElement(this.#loadingGif);

    }

    hiddenLoadingGif() {
        helper.addHiddenClassToElement(this.#loadingGif);

    }
}

export default new AddRecipeView();
