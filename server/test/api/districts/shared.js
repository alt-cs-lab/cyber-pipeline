//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

exports.shouldGetListOfDistricts = function () {
  it('should return list of districts', function (done) {
    chai
      .request(app)
      .get('/api/v1/districts/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.has.status(200)
        res.body.forEach((district) => {
            district.should.be.a('object')
            district.should.have.property('id')
            district.should.have.property('name')
            district.should.have.property('usd')
            district.should.have.property('url')
            district.should.have.property('locale')
            district.should.have.property('notes')
            district.should.have.property('teachers')
            district.should.have.property('usdName')
            district.id.should.be.a('number')
            district.name.should.be.a('string')
            district.usd.should.be.a('number')
            district.url.should.be.a('string')
            district.locale.should.be.a('number')
            district.notes.should.be.a('string')
            district.teachers.should.be.a('number')
            district.usdName.should.be.a('string')
        })
        
        done()
      })
  })
}