export async function getJsonAsync(url) {
    try {
        if (!url) throw new Error("url is null or empty");
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Error on getting data. statues code: ${response.status}`);

        const data = await response.json();

        return data;
    } catch (e) {
        throw e;
    }
}

export async function sendJsonAsync(url, NewData) {
    try {
        if (!url) throw new Error("url is null or empty");
        if (!NewData) throw new Error("data is null or empty");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(NewData),
        });

        if (!response.ok) throw new Error(`Error on getting data. statues code: ${response.status}`);

        const data = await response.json();
        return data;
    } catch (e) {
        throw e;
    }
}

export function timeOut(second) {
    return new Promise((_, reject) => setTimeout(() => {
        reject(new Error(`Time out after ${second} seconds`));
    }, second * 1000));
}

export function getItemFromLocalStorage(itemName) {
    return JSON.parse(localStorage.getItem(itemName));
}

export function addItemToLocalStorage(itemName, item) {
    localStorage.setItem(itemName, JSON.stringify(item));
}

export function generateRandomId() {
    return crypto.randomUUID().replaceAll("-", "");
}
