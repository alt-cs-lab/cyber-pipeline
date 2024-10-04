import request from 'supertest'
import app from '../app.js'
import { use, should } from 'chai'
import chaiJsonSchemaAjv from 'chai-json-schema-ajv'
use(chaiJsonSchemaAjv.create({ verbose: true }))
import * as helpers from './helpers.js'
import { expect, test } from 'vitest'

const apiShouldReturnUserData = (user) => {
  it('should return data about current user', (done) => {
    request(app)
      .get('/api/v1')
      .set('Authorization', `Bearer ${user.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.have.property('user_id').eql(user.id)
        res.body.should.have.property('version').eql(1.0)
        res.body.should.have.property('is_admin').eql(user.is_admin ? 1 : 0)
        done()
      })
  })
}

const apiSchemaShouldBeValid = (user) => {
  it('should have a valid schema', (done) => {
    const schema = {
      type: 'object',
      properties: {
        user_id: { type: 'number' },
        version: { type: 'number' },
        is_admin: { type: 'number', enum: [0, 1] },
      },
      required: ['user_id', 'version', 'is_admin'],
      additionalProperties: false,
    }
    request(app)
      .get('/api/v1')
      .set('Authorization', `Bearer ${user.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.jsonSchema(schema)
        done()
      })
  })
}

describe('/api/v1/users', () => {
  describe('user: test-admin', () => {
    let user = {
      id: 1,
      email: 'test-admin@russfeld.me',
      is_admin: true,
      token: null,
    }

    beforeEach(async () => {
      user.token = await helpers.login(user)
    })

    apiShouldReturnUserData(user)
    apiSchemaShouldBeValid(user)
  })

  describe('user: test-api', () => {
    let user = {
      id: 3,
      email: 'test-api@russfeld.me',
      is_admin: false,
      token: null,
    }

    beforeEach(async () => {
      user.token = await helpers.login(user)
    })

    apiShouldReturnUserData(user)
    apiSchemaShouldBeValid(user)
  })
})