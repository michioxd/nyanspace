export function formatData(input: number, isKB?: boolean): string {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let base = 1024;
    let bytes = isKB === true ? input * 1024 : input;

    if (bytes < base) {
        return bytes + ' bytes';
    }

    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1);
    bytes = Number((bytes / Math.pow(base, exponent)).toFixed(2));
    const unit = units[exponent];

    return `${bytes} ${unit}`;
}