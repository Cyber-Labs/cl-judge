const request = require('supertest')
const { testServer } = require('../testServer')
const { mysql } = require('../testServer')
const { mockOptions } = require('../testServer')

jest.mock('mysql')

describe('Testing how Mocking works', () => {
    it('Can mock createConnection', (done) => {
        mysql.createPool = jest.fn();
        mysql.createPool.mockImplementation(() => mysql.createPool(mockOptions));
        done()
    })
})

describe('API testing on Test Server', () => {
  it(`/ - SUCCESS`, async (done) => {
    const response = await request(testServer).get('/ridhishjain')
    expect(response.status).toEqual(200)
    expect(response.statusCode).toEqual(200)
    const { body } = response
    done()
  })
})
