//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

exports.shouldGetProfile = function (profile) {
    it('should get user profile', function (done) {
        chai
            .request(app)
            .get('/api/v1/profile/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
                res.should.has.status(200)
                res.body.should.have.property('id').eql(profile.id)
                res.body.should.have.property('eid').eql(profile.eid)
                res.body.should.have.property('name').eql(profile.name)
                done()
            })
    })
}

exports.shouldPostProfile = function () {
    it('should update profile', function (done) {
        chai
            .request(app)
            .post(`/api/v1/profile`)
            .type('json')
            .send({
                user: {
                    name: 'Test'
                }
            })
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('message').eql('Profile Saved')
                done()
            })
    })
}