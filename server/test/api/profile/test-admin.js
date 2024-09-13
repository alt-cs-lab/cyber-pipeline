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

describe('test-admin /api/v1/profile', function () {
    beforeEach(loginAsAdmin)

    const adminProfile = {
        id: 1,
        eid: 'test-admin',
        name: 'Test Administrator'
    }

    describe('GET /', function () {
        shared.shouldGetProfile(adminProfile)
    })

    describe('POST /', function () {
        shared.shouldPostProfile(adminProfile)
    })
})