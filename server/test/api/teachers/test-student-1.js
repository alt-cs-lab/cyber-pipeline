//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require Helpers
const { loginAsAdmin, loginAsStudent } = require('../../helpers')

var app = require('../../../app')

//Require Shared Tests
const shared = require('./shared')

describe('test-student-1 /api/v1/teachers', function(){
    this.beforeEach(loginAsStudent)
    describe('Get', function(){
        it('should get the list of teachers', function (done){
            chai
            .request(app)
            .get('/api/v1/teachers/')
            .auth(this.token, {type: 'bearer'})
            .end((err, res) => {
                res.should.has.status(200)
                res.body.should.be.a('array')
                res.body.forEach((teacher) => {
                    teacher.should.be.a('object')
    
                    teacher.should.have.property('id')
                    teacher.id.should.be.a('number')
    
                    teacher.should.have.property('name')
                    teacher.name.should.be.a('string')
    
                    teacher.should.have.property('email')
                    teacher.email.should.be.a('string')
    
                    teacher.should.have.property('eid')
                    teacher.eid.should.be.a('string')
    
                    teacher.should.have.property('wid')
                    teacher.wid.should.be.a('string')
    
                    teacher.should.have.property('grade_level')
                    teacher.grade_level.should.be.a('string')
    
                    teacher.should.have.property('notes')
                    teacher.notes.should.be.a('string')
                    
                    teacher.should.have.property('districts')
                    teacher.districts.should.be.a('array')
                    
                    teacher.should.have.property('cohorts')
                    teacher.cohorts.should.be.a('array')
                });
                done()
            })
        })
    })
    describe('Put', function(){
        it('should not create a teacher', function (done){
            chai
            .request(app)
            .put('/api/v1/teachers/')
            .type('json')
            .send({
                teacher: {
                    name: 'Test Teacher',
                    email: 'test@distrct.com',
                    eid: 'test-teacher',
                    wid: '000000000',
                    status: 0,
                    pd_status: 0,
                    cert_status: 0,
                    ms_status: 0,
                    grade_level: 'high school 9-12',
                    notes: 'This is a test teacher',
                    districts: [{id: 2, notes: 'Current District', primary: true}, {id: 1, notes: 'Previous District', primary: false}],
                    cohorts: [{id: 1, notes: 'Started cohort on time'}],
                    courses: [{id: 1, notes: 'Teacher is doing well', status: 0}]
                  },
              })
            .auth(this.token, {type: 'bearer'})
            .end((err, res) => {
                res.should.has.status(403)
                done()
            })
        })    
    })
    describe('Post', function(){
        it('should not edit a teacher', function (done){
            chai
            .request(app)
            .post('/api/v1/teachers/1')
            .type('json')
            .send({
                params: { id: 1 },
                teacher: {
                    name: 'Test Teacher',
                    email: 'test@distrct.com',
                    eid: 'test-teacher',
                    wid: '000000000',
                    status: 0,
                    pd_status: 0,
                    cert_status: 0,
                    ms_status: 0,
                    grade_level: 'high school 9-12',
                    notes: 'This is a test teacher',
                    districts: [{id: 2, notes: 'Current District', primary: true}, {id: 1, notes: 'Previous District', primary: false}],
                    cohorts: [{id: 1, notes: 'Started cohort on time'}],
                    courses: [{id: 1, notes: 'Teacher is doing well', status: 0}]
                  },
              })
            .auth(this.token, {type: 'bearer'})
            .end((err, res) => {
                res.should.has.status(403)
                //console.log(res.body)
                done()
            })
        })
    })
    describe('Delete', function(){
        it('should not delete a teacher', function (done){
            chai
            .request(app)
            .delete('/api/v1/teachers/1')
            .auth(this.token, {type: 'bearer'})
            .end((err, res) => {
                res.should.has.status(403)
                //console.log(res.body)
                done()
            })
        })
    })
  })