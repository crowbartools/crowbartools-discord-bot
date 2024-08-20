import { compress, decompress } from 'lz-string';

const SEPARATOR = '$&';

export const createModalId = (id: string, data?: string): string => {
    return data ? `${id}${SEPARATOR}${compress(data)}` : id;
};

export const parseModalId = (
    modalIdString: string
): { id: string; data?: string } => {
    const [id, data] = modalIdString.split(SEPARATOR);
    return { id, data: data ? decompress(data) : undefined };
};
