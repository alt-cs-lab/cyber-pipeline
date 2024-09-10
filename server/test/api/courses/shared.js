//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

exports.shouldReturn200Status = function () {
    it('GET should return 200 status', function (done) {
      chai
        .request(app)
        .get('/api/v1/courses/')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.has.status(200)
          done()
        })
    })
  }

exports.shouldReturnListOfValidCourseObjects = function () {
  it('GET should return valid list of courses', function (done) {
    chai
      .request(app)
      .get('/api/v1/courses/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.body.should.be.a('array')
        res.body.forEach((course) => {
            course.should.be.a('object')
            course.should.have.property('id')
            course.should.have.property('name')
            course.should.have.property('notes')
            course.should.have.property('teachers')
            course.id.should.be.a('number')
            course.name.should.be.a('string')
            course.notes.should.be.a('string')
            course.teachers.should.be.a('array')
          })
        done()
      })
  })
}

exports.shouldReturnCoursesWithValidTeacherObjects = function () {
    it('GET should return course list with valid teacher objects', function (done) {
      chai
        .request(app)
        .get('/api/v1/courses/')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.body.forEach((course) => {
              course.teachers.forEach((teacher) => {
                  teacher.should.have.property('id')
                  teacher.should.have.property('name')
                  teacher.should.have.property('notes')
                  teacher.should.have.property('status')
                  teacher.id.should.be.a('number')
                  teacher.name.should.be.a('string')
                  teacher.notes.should.be.a('string')
                  teacher.status.should.be.a('number')
              })
            })
          done()
        })
    })
  }