import request from 'supertest'
import app from '../app.js'
import { describe, it, beforeEach, beforeAll} from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'

// Set up environment variables
process.env.FORCE_AUTH = 'true'


//Creates a mock user
let adminUser = {
  eid:'test-admin',
  name:'Test Administrator',
  created_by: 'test-admin',
  updated_by: 'test-admin',
  id: 1, 
  is_admin: true,
  token: 'test-token',
  }

  beforeAll(async () => {
    db.migrate.latest()
  })
  
  beforeEach(async () => {
    db.seed.run()
    
  })

  //Tests that get requests return a list of all roles
  const getAllRoles = (adminUser) => {
    it('should list all roles', (done) => {
      request(app)
        .get('/api/v1/roles/')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .expect(200)
        .end((err, res) => {
        if (err) {return done(err)}
         expect(res.body).toBeInstanceOf(Array)
         expect(res.body.length).toBe(2)
         done(err)
        })
    })
  }
  

  //Tests that all roles' schema are correct
  const getAllRolesSchemaMatch = (adminUser) => {
  it('all roles should match schema', (done) => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'id',
          'name'
        ],
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', minLength: 1, maxLength: 255 },
        },
      },
      additionalProperties: false,
    }
    request(app)
      .get('/api/v1/roles/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.jsonSchema(schema)
        done()
      })
  })
}
//Test that get requests only work for users with admin role
const getAllRolesRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(app)
      .get('/api/v1/roles/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


  describe('GET /', () => {
    getAllRoles(adminUser)
    getAllRolesSchemaMatch(adminUser)
    getAllRolesRequiresAdminRole(adminUser)
  })
