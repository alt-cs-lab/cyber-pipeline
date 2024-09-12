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

describe('test-student /api/v1/districts', function () {
    beforeEach(loginAsStudent)

    describe('GET /', function () {
        shared.shouldGetListOfDistricts()
    })

    describe('PUT /', function () {
        shared.shouldNotPutDistrict()
    })

    describe('POST /', function () {
        shared.shouldNotPostDistrict()
    })

    describe('DELETE /', function () {
        shared.shouldNotDeleteDistrict()
    })
})