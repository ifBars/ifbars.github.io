const compactNumberFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
});

const fullNumberFormatter = new Intl.NumberFormat('en-US');

export function formatCompactNumber(value: number) {
    return compactNumberFormatter.format(value);
}

export function formatFullNumber(value: number) {
    return fullNumberFormatter.format(value);
}
