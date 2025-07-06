class SearchView {
    #searchElement = document.querySelector('.header .search');
    #textInputElement = document.querySelector('.header .search .text-input');
    #searchBtnElement = document.querySelector('.header .search .search-btn');

    getSearchQuery() {

        return this.#textInputElement.value;
    }
    

    clearTextInput(callBackFunc) {
        this.#textInputElement.value = "";
    }

    addSubmitEventToSearch(callBackFunc) {
        this.#searchElement.addEventListener("submit", function (e) {
            e.preventDefault();
            callBackFunc();
        });
    }
}

export default new SearchView();