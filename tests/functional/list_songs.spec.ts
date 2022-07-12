import { faker } from '@faker-js/faker';
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Song from 'App/Models/Song'

const createRandomSong = () => ({
  songName: faker.lorem.words(),
  band: faker.lorem.words(),
  year: faker.datatype.number()
})

test.group('List songs', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('returns a list of existing songs in the database', async ({ client, assert }) => {
    await Song.createMany([null, null, null].map(createRandomSong))

    const songs = await Song.all()
    const expectedLength = songs.length

    const response = await client.get('/api/songs')
    const body = response.body()

    assert.isArray(body)
    assert.lengthOf(body, expectedLength)
    assert.containsSubset(body, songs.map(song => song.serialize()))
  })
})
