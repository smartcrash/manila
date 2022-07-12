import Song from 'App/Models/Song'
import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { parse as parseCSV } from 'csv';
import { createReadStream } from 'fs';

const createError = (message: string) => ({ error: message })

interface Response {
  error?: string
  data?: any[]
}

// TODO: Move to it's own file

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

export default class SongsController {
  /**
   * List all songs
   */
  public async index({ }: HttpContextContract): Promise<Response> {
    const songs = await Song.all()

    return { data: songs }
  }

  /**
   * Handle song creation form request
   */
  public async store({ request }: HttpContextContract): Promise<Response> {
    const extnames = ["xlsx", "xls", "csv"];
    const file = request.file('file', { size: '2mb', extnames })

    if (!file) return createError(`Please upload a valid a file, the accepted formats are: ${extnames.map(ext => `.${ext}`).join(', ')}`)
    if (!file.isValid) return createError(file.errors[0].message)

    // Move the file to a tmp folder so we can read it
    await file.move(Application.tmpPath('uploads'))
    const { filePath } = file

    // Extract data from file as an array of array of string
    const rows = await readCSV(filePath!, { delimiter: ',', from_line: 2 })
    const isValid = rows.every((row) => row.length === 3 && row.every(value => !!value))

    if (!isValid) return createError('Expected the CSV file to have 4 columns with non-empty values.')

    console.log('Everyhing is good pal!');

    return { data: rows }
  }
}
