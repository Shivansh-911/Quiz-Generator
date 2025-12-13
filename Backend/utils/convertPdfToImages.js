import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import * as pdfParse from 'pdf-parse';


async function convertPdfToImages(pdfPath) {
    console.log('Converting PDF to images...');
    const savePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../tmp');

    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
    }

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    const outputPrefix = path.join(savePath, 'page');

    return new Promise((resolve, reject) => {
        execFile('pdftoppm', [
            '-png',
            '-r', '200',
            pdfPath,
            outputPrefix
        ], (error, stdout, stderr) => {
            if (error) {
                console.error('pdftoppm failed:', stderr);
                return reject(error);
            }

            const imagePaths = [];
            for (let i = 1; i <= data.numpages; i++) {
                const imagePath = `${outputPrefix}-${i}.png`;
                imagePaths.push(imagePath);
            }

            resolve(imagePaths);
        });
    });
}

export default convertPdfToImages;
