//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require Helpers
const { loginAsAdmin } = require('../../helpers')

var app = require('../../../app')

describe('test-admin /api/v1/dashboard', function () {
  beforeEach(loginAsAdmin)

  describe('GET /cohort/status', function () {
    it('should have access', function (done) {
      chai
        .request(app)
        .get('/api/v1/dashboard/cohort/status')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.has.status(200)
          done()
        })
      })
  })

  describe('GET /cohort/pdstatus', function () {
    it('should have access', function (done) {
      chai
        .request(app)
        .get('/api/v1/dashboard/cohort/pdstatus')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.has.status(200)
          done()
        })
      })
  })

  describe('GET /cohort/certstatus', function () {
    it('should have access', function (done) {
      chai
        .request(app)
        .get('/api/v1/dashboard/cohort/certstatus')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.has.status(200)
          done()
        })
      })
  })

  describe('GET /cohort/msstatus', function () {
    it('should have access', function (done) {
      chai
        .request(app)
        .get('/api/v1/dashboard/cohort/msstatus')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.has.status(200)
          done()
        })
      })
  })
})