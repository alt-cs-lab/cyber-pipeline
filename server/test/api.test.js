import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach, beforeAll} from 'vitest'
import 'dotenv/config'



const apiShouldReturnUserData = (user) => {
    it('should return data about current user', (done) => {
      request(app)
        .get('/api/v1')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).property('user_id').eql(user.id)
          expect(res.body).property('version').eql(1.0)
          expect(res.body).property('is_admin').eql(user.is_admin ? 1 : 0)
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
          expect(res.body).jsonSchema(schema)
          done()
        })
    })
  }
  
  describe('/api/v1/users', () => {
    describe('user: test-admin', () => {
    //Creates a mock user
    let adminUser = {
        eid:'test-admin',
        name:'Test Administrator',
        id: 1, 
        is_admin: true,
        token: 'test-token',
    }
  
  
      apiShouldReturnUserData(adminUser)
      apiSchemaShouldBeValid(adminUser)
    })
  
    describe('user: test-api', () => {
      let user = {
        id: 3,
        email: 'testemail@gmail.com',
        is_admin: false,
        token: 'test-token'
      }
    
  
      apiShouldReturnUserData(user)
      apiSchemaShouldBeValid(user)
    })
  })