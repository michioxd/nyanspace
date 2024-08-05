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

export function fileTypeIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    if ([
        'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'vob', 'ogv', 'm4v',
        'mpg', 'mpeg', '3gp', '3g2', 'm2ts', 'mts', 'rm', 'rmvb', 'divx', 'xvid', 'mxf'
    ].includes(extension)) return 'file-video';
    if ([
        'mp3', 'ogg', 'wav', 'flac', 'aac', 'wma', 'm4a', 'aiff', 'alac', 'midi', 'mid',
        'aif', 'ape', 'au', 'ra', 'mpc', 'opus'
    ].includes(extension)) return 'file-music';
    if ([
        'png', 'gif', 'jpg', 'jpeg', 'bmp', 'tiff', 'svg', 'webp', 'ico', 'heic', 'heif', 'raw',
        'nef', 'cr2', 'orf', 'arw', 'dng', 'rw2', 'psd', 'ai', 'eps'
    ].includes(extension)) return 'file-image';
    if ([
        'js', 'ts', 'java', 'py', 'rb', 'go', 'rs', 'cpp', 'c', 'cs', 'swift', 'kt', 'kts', 'php',
        'html', 'css', 'scss', 'sass', 'xml', 'json', 'yaml', 'yml', 'sql', 'sh', 'bat', 'pl', 'pm',
        'r', 'm', 'h', 'hpp', 'ino', 'dart', 'lua', 'erl', 'ex', 'exs', 'fs', 'fsi', 'fsx', 'ml',
        'mli', 'pas', 'pp', 'vb', 'vbs', 'asm', 's', 'scm', 'clj', 'cljs', 'groovy', 'gradle', 'md',
        'markdown', 'rst', 'rmd', 'rmarkdown', 'ipynb', 'jl', 'coffee', 'jsx', 'tsx', 'vue',
        'php', 'php3', 'php4', 'php5', 'php7', 'php8', 'phtml', 'ctp', 'twig', 'tpl', 'blade.php',
        'jsp', 'jspx', 'tag', 'tagx', 'do', 'action', 'class', 'jar', 'war', 'ear', 'java', 'kt',
        'toml', 'ini', 'cfg', 'conf', 'properties', 'env', 'env.example', 'env.sample', 'env.local',
        'env.dev', 'env.development', 'env.prod', 'env.production', 'env.staging', 'env.test',
        'cjs', 'mjs'
    ].includes(extension)) return 'file-code';
    if ([
        'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lzma', 'tgz', 'tbz2', 'iso', 'dmg', 'cab',
        'ace', 'z', 'arj', 'apk', 'jar', 'tar.gz', 'tar.bz2', 'tar.xz'
    ].includes(extension)) return 'file-cabinet';

    if ([
        'xls', 'xlsx', 'xlsm', 'xlsb', 'xltx', 'xltm', 'xlam', 'xla', 'xlt', 'ods', 'csv', 'tsv',
        'db', 'mdb', 'accdb', 'sql', 'sqlite', 'dbf', 'db3', 'frm', 'myd', 'myi', 'ibd', 'sqlitedb',
        'sqlite3', 'sql', 'bak', 'ldf', 'mdf', 'ibdata1', 'ib_logfile0', 'ib_logfile1', 'frm',
        'myd', 'myi', 'ibd', 'sqlitedb', 'sqlite3', 'sql', 'bak', 'ldf', 'mdf', 'ibdata1',
        'ib_logfile0', 'ib_logfile1'
    ].includes(extension)) return 'file-table';

    return 'file';
}

export function convertTime(seconds: number): { days: number, hours: number, mins: number, secs: number } {
    return {
        days: Math.floor(seconds / 86400),
        hours: Math.floor(seconds % 86400 / 3600),
        mins: Math.floor(seconds % 3600 / 60),
        secs: Math.floor(seconds % 60)
    };
}
