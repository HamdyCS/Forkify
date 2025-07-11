export function getNumberOfPages(arrayLength, pageSize) {
    return Math.ceil((arrayLength / pageSize));
}