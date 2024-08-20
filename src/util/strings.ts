export function escapeRegExp(input: string): string {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); //eslint-disable-line no-useless-escape
}

export function limitString(
    input: string,
    lengthLimit: number,
    suffix?: string
): string {
    if (input.length > lengthLimit) {
        input = input.substring(0, lengthLimit - 1);
        if (suffix) {
            input = input.trim() + suffix;
        }
    }
    return input;
}

export const capitalize = (input: string, forceRemainingLower = true): string =>
    input.charAt(0).toUpperCase() +
    (forceRemainingLower ? input.slice(1).toLowerCase() : input.slice(1));
