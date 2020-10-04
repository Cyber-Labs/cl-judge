const request = require('supertest')
const server = require('../../testServer')

const success = () => it(`/ - SUCCESS`, async (done) => {
    const response = await request(server).get('/')
    expect(response.status).toEqual(200)
    expect(response.statusCode).toEqual(200)
    const { body } = response
    expect(body).toEqual({
        'success': true,
        'results': {},
        'error': null
    })
    done()
})

module.exports = success
