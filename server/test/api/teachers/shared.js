//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()
const jwt = require('jsonwebtoken')

//Require app dependencies
var app = require('../../../app')

exports.shouldGetTeacherList = function(){
    it('should get the list of teachers', function (done){
        chai
        .request(app)
        .get('/api/v1/teachers/')
        .auth(this.token, {type: 'bearer'})
        .end((err, res) => {
            res.should.has.status(200)
            res.body.should.be.a('array')
            console.log(res.body)
            done()
        })
    })
}