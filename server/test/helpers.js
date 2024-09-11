//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../app')

const loginAsAdmin = function (done) {
  var agent = chai.request.agent(app)
  agent.get('/auth/login?eid=test-admin').end(() => {
    agent.get('/auth/token').end((err, res) => {
      this.token = res.body.token
      if (!this.tokens) this.tokens = {}
      this.tokens['admin'] = res.body.token
      res.should.have.status(200)
      agent.close()
      done()
    })
  })
}

const loginAsStudent = function (done) {
  var agent = chai.request.agent(app)
  agent.get('/auth/login?eid=test-student').end(() => {
    agent.get('/auth/token').end((err, res) => {
      this.token = res.body.token
      if (!this.tokens) this.tokens = {}
      this.tokens['user'] = res.body.token
      res.should.have.status(200)
      agent.close()
      done()
    })
  })
}

module.exports = {
    loginAsAdmin: loginAsAdmin,
    loginAsStudent: loginAsStudent,
  }
  