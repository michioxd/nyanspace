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

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(\.?(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/;

export function isIPv6(ip: string): boolean {
    return ipv6Regex.test(ip);
}

export function isIPv4(ip: string): boolean {
    return ipv4Regex.test(ip);
}