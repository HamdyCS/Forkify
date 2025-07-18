import * as helper from "./helper.js";

class DocumentView {
    #overlay = document.querySelector('.overlay');

    addEscapeClickEventToDocument(callbackFunc) {
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                callbackFunc(e);
            }
        })
    }

    hiddenOverlay() {
        helper.addHiddenClassToElement(this.#overlay)
    }

    showOverlay() {
        helper.removeHiddenClassFromElement(this.#overlay)
    }

    addClickEventToOverlay(callbackFunc) {
        this.#overlay.addEventListener("click", callbackFunc);
    }


}

export default new DocumentView();