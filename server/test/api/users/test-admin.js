//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require Helpers
const { loginAsAdmin } = require('../../helpers')

var app = require('../../../app')

describe('test-admin /api/v1/users', function () {
  beforeEach(loginAsAdmin)

  describe('GET /', function () {
    it('should return list of users', function (done) {
      chai
        .request(app)
        .get('/api/v1/users/')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.has.status(200)
          res.body.should.be.a('array')
          res.body.forEach((user) => {
            user.should.be.a('object')
            user.should.have.property('id')
            user.should.have.property('eid')
            user.should.have.property('name')
            user.should.have.property('roles')
            user.id.should.be.a('number')
            user.eid.should.be.a('string')
            user.name.should.be.a('string')
            user.roles.should.be.a('array')
          })
          done()
        })
      })
  })

  describe('PUT /', function () {
    it('should creation of new users', function (done) {
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
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
      })
    })
  })

  describe('POST /', function () {
    it('should allow updating of users', function (done) {
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
          res.should.have.status(200)
          done()
        })
    })
  })

  describe('DELETE /:id', function () {
    it('should allow deleting of users', function (done) {
      chai
        .request(app)
        .delete('/api/v1/users/2')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})