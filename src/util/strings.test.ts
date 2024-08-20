import { capitalize, limitString } from './strings';

test('should captialize first letter and lowercase the rest', () => {
    const input = 'teSt';
    const expectedOutput = 'Test';

    const result = capitalize(input);

    expect(result).toEqual(expectedOutput);
});

test('should captialize first letter and leave rest alone if forceRemainingLower is false', () => {
    const input = 'teSt';
    const expectedOutput = 'TeSt';

    const result = capitalize(input, false);

    expect(result).toEqual(expectedOutput);
});

test('should not limit string if length is less than limit', () => {
    const input = 'short text';

    const result = limitString(input, 10);

    expect(result).toEqual(input);
});

test('should limit string if length is greater than limit', () => {
    const input = 'longer text';
    const expectedOutput = 'longer te';

    const result = limitString(input, 10);

    expect(result).toEqual(expectedOutput);
});

test('should limit string and add suffix if length is greater than limit', () => {
    const input = 'longer text';
    const expectedOutput = 'longer te...';

    const result = limitString(input, 10, '...');

    expect(result).toEqual(expectedOutput);
});
