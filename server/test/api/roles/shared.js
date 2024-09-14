//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()
const jwt = require('jsonwebtoken')

//Require app dependencies
var app = require('../../../app')

exports.shouldGetRoleList = function(){
    it('should get the list of roles' , function (done){
        chai
        .request(app)
        .get('/api/v1/roles/')
        .auth(this.token, {type: 'bearer'})
        .end((err, res) => {
            res.should.has.status(200)
            res.body.should.be.a('array')
            //console.log(res.body)
            res.body.forEach((role) => {
                role.should.be.a('object')
                role.should.have.property('id')
                role.should.have.property('name')
                role.id.should.be.a('number')
                role.name.should.be.a('string')
            });
            done()
        })
    })
}