import { join } from "path";
import { test } from '@japa/runner'
import Song from "App/Models/Song";

test.group('Store song', () => {
  test('should return error if file is not uploaded', async ({ client, assert }) => {
    const response = await client.post('/api/songs')
    const body = response.body()

    assert.property(body, 'error')
    assert.isString(body.error)
    assert.isTrue(body.error.startsWith('Please upload a valid a file'))

  })
  test('should return error if a file with invalid extname is uploaded', async ({ client, assert }) => {
    const response = await client
      .post('/api/songs')
      .file('file', join(__dirname, 'fixtures/invalid.txt'))

    const body = response.body()

    assert.property(body, 'error')
    assert.isString(body.error)
    assert.isTrue(body.error.startsWith('Invalid file extension'))
  })

  test('should return error if file does not have exactly 3 columns', async ({ client, assert }) => {
    const response = await client
      .post('/api/songs')
      .file('file', join(__dirname, 'fixtures/song_list.2_columns.csv'))
    const body = response.body()

    assert.property(body, 'error')
    assert.isString(body.error)
    assert.equal(body.error, 'Expected the data to have 3 columns')
  })

  test('should return error if file have empty values', async ({ client, assert }) => {
    const response = await client
      .post('/api/songs')
      .file('file', join(__dirname, 'fixtures/song_list.with_empty_values.csv'))
    const body = response.body()

    assert.property(body, 'error')
    assert.isString(body.error)
    assert.equal(body.error, 'Expected the data to have no empty values')
  })

  test('should create songs if valid file is uploaded, and returns the inserted records', async ({ client, assert }) => {
    const response = await client
      .post('/api/songs')
      .file('file', join(__dirname, 'fixtures/song_list.csv'))
    const body = response.body()

    const expectedArray = [
      { song_name: 'Crazy', band: 'Aerosmith', year: 1990 },
      { song_name: 'With Or Without You', band: 'U2', year: 1988 },
      { song_name: 'Michael Jackson', band: 'Billy Jean', year: 1984 },
    ]
    const expectedLength = expectedArray.length

    assert.notProperty(body, 'error')
    assert.property(body, 'data')
    assert.isArray(body.data)
    assert.lengthOf(body.data, expectedLength)
    assert.containsSubset(body.data, expectedArray)

    const songs = await Song.all()

    assert.lengthOf(songs, expectedLength)
    assert.containsSubset(songs.map(song => song.serialize()), expectedArray)
  })
})
