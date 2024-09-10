//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require Helpers
const { loginAsAdmin } = require('../../helpers')

var app = require('../../../app')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin /api/v1/courses', function () {
  beforeEach(loginAsAdmin)

    describe('GET /', function () {
        shared.shouldGetListOfCourses()
    })

    describe('PUT /', function () {
        it('should create new course', function (done) {
            chai
              .request(app)
              .put('/api/v1/courses/')
              .type('json')
              .send({
                course: {
                    name: 'New Course Name',
                    notes: 'Some notes about the course',
                    teachers: [
                      { id: 1, notes: 'Experienced teacher', status: 1 },
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
        
    })

    describe('DELETE /:id', function () {
        
    })
})