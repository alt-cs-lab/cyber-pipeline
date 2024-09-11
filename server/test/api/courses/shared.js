//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

exports.shouldGetListOfCourses = function () {
  it('should return list of courses', function (done) {
    chai
      .request(app)
      .get('/api/v1/courses/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.has.status(200)
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