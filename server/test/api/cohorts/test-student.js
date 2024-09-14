//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

var app = require('../../../app')

//Require Helpers
const { loginAsStudent } = require('../../helpers')

describe('test-student /api/v1/cohorts', function () {
  beforeEach(loginAsStudent)

    describe('GET /', function () {
      it('should not get list of cohorts', function (done) {
        chai
          .request(app)
          .get('/api/v1/cohorts/')
          .auth(this.token, { type: 'bearer' })
          .end((err, res) => {
            res.should.has.status(403)
            done()
          })
        })
    })

    describe('PUT /', function () {
      it('should not allow creation of new cohort', function (done) {
          chai
            .request(app)
            .put('/api/v1/cohorts/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(403)
              done()
          })
      })
  })

  describe('POST /', function () {
      it('should not allow updating of cohorts', function (done) {
          chai
            .request(app)
            .post('/api/v1/cohorts/1')
            .send({
              params: { id: 1 },
              cohort: {
                  name: 'Valid Course Name',
                  notes: 'Some notes about the course',
                  teachers: [ 
                      { id: 1, notes: 'Experienced teacher', status: 1 },
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
      it('should not allow deleting of cohort', function (done) {
          chai
            .request(app)
            .delete('/api/v1/cohorts/1')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(403)
              done()
            })
        })
  })
})