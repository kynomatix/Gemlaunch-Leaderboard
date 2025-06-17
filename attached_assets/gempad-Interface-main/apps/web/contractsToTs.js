/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable lodash/import-scope */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function convertToJsonToTs(filepath) {
    const jsonString = fs.readFileSync(filepath, 'utf-8');
    const artifact = JSON.parse(jsonString);

    const { contractName } = artifact;
    const abi = JSON.stringify(artifact.abi, null, 2);
    const bytecode = JSON.stringify(artifact.bytecode);
    const linkReferences = JSON.stringify(artifact.linkReferences);

    return `export const ${_.camelCase(contractName)} = {
  contractName: '${contractName}',
  abi: ${abi}  as const,
  bytecode: ${bytecode}  as \`0x\${string}\`,
  linkReferences: ${linkReferences},
};`;
}

function processFolderRecursive(folderPath, outputFolder) {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        const filepath = path.join(folderPath, file);
        const stats = fs.statSync(filepath);

        if (!file.endsWith('.dbg.json')) {
            const contractName = path.basename(file, '.json');

            if (stats.isFile() && path.extname(file) === '.json') {
                const tsData = convertToJsonToTs(filepath);

                const outputFile = path.join(
                    outputFolder.replace(`\\${_.camelCase(contractName)}`, ''),
                    `${_.camelCase(contractName)}.ts`,
                );

                console.log(outputFile);

                fs.writeFileSync(outputFile, tsData, 'utf-8');
                // console.log(`${file} converted to TypeScript: ${outputFile}`);
            } else if (stats.isDirectory()) {
                const subOutputFolder = path.join(
                    outputFolder,
                    _.camelCase(contractName.replace(/\.sol$/, '')),
                );
                fs.mkdirSync(subOutputFolder, { recursive: true });
                processFolderRecursive(filepath, subOutputFolder);
            }
        }
    });
}

function cleanEmptyFoldersRecursively(folder) {
    const isDir = fs.statSync(folder).isDirectory();
    if (!isDir) {
        return;
    }
    let files = fs.readdirSync(folder);
    if (files.length > 0) {
        files.forEach(function (file) {
            const fullPath = path.join(folder, file);
            cleanEmptyFoldersRecursively(fullPath);
        });

        // re-evaluate files; after deleting subfolder
        // we may have parent folder empty now
        files = fs.readdirSync(folder);
    }

    if (files.length === 0) {
        // console.log("removing: ", folder);
        fs.rmdirSync(folder);
    }
}

function main() {
    const inputFolder = './contracts/raw/'; // Replace with the path to your folder containing the JSON files
    const outputFolder = './contracts/generated/'; // Replace with the path to the folder where you want to save the TS files

    processFolderRecursive(inputFolder, outputFolder);

    cleanEmptyFoldersRecursively(outputFolder);
}

main();
