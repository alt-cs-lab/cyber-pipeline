//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require Helpers
const { loginAsAdmin } = require('../../helpers')

var app = require('../../../app')

describe('test-admin /api/v1/cohorts', function () {
  beforeEach(loginAsAdmin)

    describe('GET /', function () {
      it('should return list of cohorts', function (done) {
        chai
          .request(app)
          .get('/api/v1/cohorts/')
          .auth(this.token, { type: 'bearer' })
          .end((err, res) => {
            res.should.has.status(200)
            res.body.should.be.a('array')
            res.body.forEach((cohort) => {
              cohort.should.be.a('object')
              cohort.should.have.property('id')
              cohort.should.have.property('name')
              cohort.should.have.property('notes')
              cohort.should.have.property('teachers')
              cohort.id.should.be.a('number')
              cohort.name.should.be.a('string')
              cohort.notes.should.be.a('string')
              cohort.teachers.should.be.a('array')
            })
            done()
          })
        })
    })

    describe('PUT /', function () {
      it('should create new cohort', function (done) {
        chai
          .request(app)
          .put('/api/v1/cohorts/')
          .type('json')
          .send({
            cohort: {
                name: 'New Cohort Name',
                notes: 'Some notes about the cohort',
                teachers: [
                  { id: 1, notes: 'teacher', status: 1 },
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
      it('should allow updating of cohorts', function (done) {
        chai
          .request(app)
          .post('/api/v1/cohorts/1')
          .send({
            params: { id: 1 },
            cohort: {
                name: 'Valid Cohort Name',
                notes: 'Some notes about the cohort',
                teachers: [ 
                    { id: 1, notes: 'Experienced teacher', status: 1 },
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
      it('should allow deleting of cohorts', function (done) {
        chai
          .request(app)
          .delete('/api/v1/cohorts/1')
          .auth(this.token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
})