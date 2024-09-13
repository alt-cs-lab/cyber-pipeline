//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require Helpers
const { loginAsStudent } = require('../../helpers')

var app = require('../../../app')

//Require Shared Tests
const shared = require('./shared')

describe('test-student /api/v1/profile', function () {
    beforeEach(loginAsStudent)

    const studentProfile = {
        id: 3,
        eid: 'test-student',
        name: 'Test Student'
    }

    describe('GET /', function () {
        shared.shouldGetProfile(studentProfile)
    })

    describe('POST /', function () {
        shared.shouldPostProfile(studentProfile)
    })
})