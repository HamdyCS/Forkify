import * as helper from "./helper";

class PaginationView {
    #paginationElement = document.querySelector(".recipes .recipe-list-container .recipes-list-pagination");

    #previousBtnElement = document.querySelector(".recipes .recipe-list-container .recipes-list-pagination .previous");
    #nextBtnElement = document.querySelector(".recipes .recipe-list-container .recipes-list-pagination .next");
    #previousBtnPageNumberElement = document.querySelector(".recipes .recipe-list-container .recipes-list-pagination .previous .page-number ");
    #nextBtnPageNumberElement = document.querySelector(".recipes .recipe-list-container .recipes-list-pagination .next .page-number ");

    showPagination() {
        helper.removeHiddenClassFromElement(this.#paginationElement);
    }

    hiddenPagination() {
        helper.addHiddenClassToElement(this.#paginationElement);
    }

    updatePreviousBtnVisibility(isVisible = true) {
        this.#previousBtnElement.style.visibility = isVisible ? "visible" : "hidden";
    }

    updateNextBtnShowVisibility(isVisible = true) {
        this.#nextBtnElement.style.visibility = isVisible ? "visible" : "hidden";
    }

    updatePreviousBtnPageNumberText(pageNumber) {
        this.#previousBtnPageNumberElement.textContent = pageNumber;
    }

    updateNextBtnPageNumberText(pageNumber) {
        this.#nextBtnPageNumberElement.textContent = pageNumber;
    }

    addClickEventsToNextBtn(callBackFunc) {
        this.#nextBtnElement.addEventListener("click", callBackFunc);
    }

    addClickEventsToPreviousBtn(callBackFunc) {
        this.#previousBtnElement.addEventListener("click", callBackFunc);
    }
}

export default new PaginationView();