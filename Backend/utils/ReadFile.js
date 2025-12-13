import fs from 'fs';
import path from 'path';
import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const readTxtFile = (filePath) => {
    return fs.promises.readFile(filePath, 'utf8');
};

const readDocxFile = async (filePath) => {
    const data = await fs.promises.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: data });
    return result.value;
};

const readPdfFile = async (filePath) => {
    const dataBuffer = await fs.promises.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
};

async function readFileBasedOnType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    console.log("file extension:", ext);
    switch (ext) {
        case '.txt':
            return await readTxtFile(filePath);
        case '.docx':
            return await readDocxFile(filePath);
        case '.pdf':
            return await readPdfFile(filePath);
        default:
            throw new Error(`Unsupported file format: ${ext}`);
    }
}

export default readFileBasedOnType;
