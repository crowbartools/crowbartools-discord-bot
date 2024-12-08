import { isJSONEncodable } from 'discord.js';

export function replaceVariables<T>(
    variableMap: Record<string, unknown>,
    obj: T
): T {
    if (typeof obj === 'string') {
        return replaceVariablesInString(variableMap, obj) as unknown as T;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            replaceVariables(variableMap, item)
        ) as unknown as T;
    }

    if (typeof obj === 'object') {
        const newObj = isJSONEncodable(obj) ? (obj.toJSON() as T) : { ...obj };
        for (const key in newObj) {
            newObj[key] = replaceVariables(variableMap, newObj[key]);
        }
        return newObj;
    }

    return obj;
}

export function replaceVariablesInString(
    variables: Record<string, unknown>,
    str: string
): string {
    Object.entries(variables).forEach(([key, value]) => {
        str = str.replaceAll(key, value?.toString());
    });
    return str;
}
