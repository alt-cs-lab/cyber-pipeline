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
    shared.shouldGetTeacherList()
      describe('Student tests', function(){
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
  })