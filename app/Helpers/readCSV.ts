import { parse as parseCSV } from 'csv';
import { createReadStream } from 'fs';

interface Options {
  delimiter?: string
  from_line?: number
}

const readCSV = async (filePath: string, options: Options = {}) => {
  return new Promise<string[][]>((resolve, reject) => {
    const result: string[][] = []

    createReadStream(filePath)
      .pipe(parseCSV(options))
      .on('data', (data) => result.push(data))
      .on("end", () => resolve(result))
      .on('error', (error) => reject(error))
  })
}

export default readCSV
