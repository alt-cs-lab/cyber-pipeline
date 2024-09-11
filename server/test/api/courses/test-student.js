//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

var app = require('../../../app')

//Require Shared Tests
const shared = require('./shared')

//Require Helpers
const { loginAsStudent } = require('../../helpers')

describe('test-student /api/v1/courses', function () {
  beforeEach(loginAsStudent)

    describe('GET /', function () {
        shared.shouldGetListOfCourses()
    })

    describe('PUT /', function () {
        it('should not allow creation of new courses', function (done) {
            chai
              .request(app)
              .put('/api/v1/courses/')
              .auth(this.token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(403)
                done()
            })
        })
    })

    describe('POST /', function () {
        it('should not allow updating of courses', function (done) {
            chai
              .request(app)
              .post('/api/v1/courses/1')
              .send({
                params: { id: 1 },
                course: {
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
        it('should not allow deleting of courses', function (done) {
            chai
              .request(app)
              .delete('/api/v1/courses/1')
              .auth(this.token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(403)
                done()
              })
          })
    })
})