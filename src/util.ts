export function escapeRegExp(input: string): string {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); //eslint-disable-line no-useless-escape
}
