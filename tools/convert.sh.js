const fs = require('fs');
const path = require('path');

fs.readFile("./src/misc/nyanspace.sh", 'utf8', (err, content) => {
    if (err) {
        console.error(`Error reading file from path "${inputFilePath}":`, err);
        return;
    }

    let escapedContent = content
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\$/g, "\\$")
        .replace(/\%/g, "%%")
        .replace(/\"/g, '\\\"')
        .replace(/\\\"/g, '\\\\\\"')

    escapedContent = `export const initialCommand: string = String.raw\` mkdir ~/.nyanspace | printf "${escapedContent}" > ~/.nyanspace/.nyanspace.sh | chmod +x ~/.nyanspace/.nyanspace.sh\``;

    fs.writeFile("./src/utils/initialCommand.ts", escapedContent, err => {
        if (err) {
            console.error(`Error writing file: `, err);
            return;
        }
        console.log(`OK`);
    });
});
