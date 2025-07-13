export function removeHiddenClassFromElement(element) {
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
    }
}

export function addHiddenClassToElement(element) {

    if (!element.classList.contains('hidden')) {
        element.classList.add('hidden');
    }
}

export function toggleHiddenClassFromElement(element) {
    element.classList.toggle('hidden');
}

