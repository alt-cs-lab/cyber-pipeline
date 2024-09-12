//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

var app = require('../../../app')

//Require Helpers
const { loginAsStudent } = require('../../helpers')

describe('test-student /api/v1/users', function () {
  beforeEach(loginAsStudent)

  describe('GET /', function () {
    it('should not return list of users', function (done) {
      chai
        .request(app)
        .get('/api/v1/users/')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.has.status(403)
          done()
        })
      })
  })

  describe('PUT /', function () {
    it('should not creation of new users', function (done) {
      chai
        .request(app)
        .put('/api/v1/users/')
        .type('json')
        .send({
          user: {
              eid: 'user eid',
              name: 'user name',
              roles: [
                { id: 2, role: 'user'},
              ],
            },
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(403)
          done()
      })
    })
  })

  describe('POST /', function () {
    it('should not allow updating of users', function (done) {
      chai
        .request(app)
        .post('/api/v1/users/1')
        .send({
          params: { id: 1 },
          user: {
              eid: 'user eid',
              name: 'user name',
              roles: [ 
                { id: 2, role: 'user'},
              ],
          },
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
  })

  describe('DELETE /:id', function () {
    it('should not allow deleting of users', function (done) {
      chai
        .request(app)
        .delete('/api/v1/users/1')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
  })
})