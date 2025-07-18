import * as helper from './helper.js';

export default class View {

    _parentElement;
    _data;

    /**
     * render object to dom
     * @param {object || object[]} data the data to be render
     * @return undefined not return any things
     * @this {object} View instance
     * @author Hamdy Khaled
     * @todo Finish implementation
     */
    render(data) {
        // if (!data || !data.length >= 1)
        //     return;

        this._data = data;
        this.#clear();

        const markup = this._generateMarkup();
        this._parentElement.insertAdjacentHTML('beforeend', markup);
    }

    #clear() {
        this._parentElement.innerHTML = '';
    }

    _generateMarkup() {

    };

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        if (!newMarkup) return;

        //convert string to dom (virtual dom)
        const newDom = document.createRange().createContextualFragment(newMarkup);

        //get all new elements
        const newElements = [...newDom.querySelectorAll("*")];

        //get all current elements
        const currentElements = [...this._parentElement.querySelectorAll("*")];


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

    toggleShow() {
        helper.toggleHiddenClassFromElement(this._parentElement);
    }

    hidden() {
        helper.addHiddenClassToElement(this._parentElement);
    }

    show() {
        helper.removeHiddenClassFromElement(this._parentElement);
    }
}