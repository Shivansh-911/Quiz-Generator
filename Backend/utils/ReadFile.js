import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';


const readTxtFile = (filePath) => fs.promises.readFile(filePath, 'utf8');

const readDocxFile = async (filePath) => {
  const data = await fs.promises.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer: data });
  return result.value;
};

const readPdfFile = async (filePath) => {
  const dataBuffer = await fs.promises.readFile(filePath);
  //const pdfData = await PDFParse(dataBuffer); // note .default
  



  const parser = new PDFParse({data: dataBuffer});
  const result = await parser.getText();
  await parser.destroy();
  console.log(result);
  return result.text;
  
};

async function readFileBasedOnType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
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
