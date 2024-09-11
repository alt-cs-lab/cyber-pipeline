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

describe('test-student-1 /api/v1/roles', function(){
  this.beforeEach(loginAsStudent)
    describe('GET /', function(){
      it('should not get the list of roles' , function (done){
        chai
        .request(app)
        .get('/api/v1/roles/')
        .auth(this.token, {type: 'bearer'})
        .end((err, res) => {
            res.should.has.status(403)
            done()
        })
    })
    })
})