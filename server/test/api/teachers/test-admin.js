//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require Helpers
const { loginAsAdmin } = require('../../helpers')

var app = require('../../../app')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin /api/v1/teachers', function(){
    this.beforeEach(loginAsAdmin)
      describe('Admin tests', function(){
        shared.shouldGetTeacherList()
        shared.shouldCreateTeacher()
        shared.shouldEditTeacher()
        shared.shouldDeleteTeacher()
      })
  })


