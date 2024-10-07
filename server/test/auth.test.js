import request from 'supertest'
import app from '../app.js'
import { describe, it} from 'vitest'
import 'dotenv/config'

const shouldAllowLogin = (user) => {
  it('should allow ' + user.eid + ' to log in and get token', (done) => {
    const agent = request.agent(app)
    agent.get('/auth/login?eid=' + encodeURIComponent(user.eid)).end(() => {
      agent
        .get('/auth/token')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          const token = res.body.token
          agent
            .get('/api/v1')
            .auth(token, { type: 'bearer' })
            .expect(200)
            .end(() => {
              done()
            })
        })
    })
  })
}

const loginShouldRedirectToHomepage = (user) => {
  it('should redirect ' + user.eid + ' to homepage', (done) => {
    const agent = request.agent(app)
    agent
      .get('/auth/login?eid=' + encodeURIComponent(user.eid))
      .expect(302)
      .expect('Location', '/')
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

const tokenShouldIncludeUserData = (user) => {
  it('should include user info in token', (done) => {
    const agent = request.agent(app)
    agent.get('/auth/login?eid=' + encodeURIComponent(user.eid)).end(() => {
      agent
        .get('/auth/token')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          const token = res.body.token
          const token_user = jwt.decode(token)
          expect(token_user).property('user_id').eql(user.id)
          expect(token_user).property('email').eql(user.email)
          expect(token_user).property('is_admin').eql(user.is_admin)
          done()
        })
    })
  })
}

const tokenShouldBeValid = (user) => {
  it('should have a valid token signature', (done) => {
    const agent = request.agent(app)
    agent.get('/auth/login?eid=' + encodeURIComponent(user.eid)).end(() => {
      agent
        .get('/auth/token')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          const token = res.body.token
          jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) return done(err)
            expect(decoded).property('user_id').eql(user.id)
            expect(decoded).property('email').eql(user.email)
            expect(decoded).property('is_admin').eql(user.is_admin)
            done()
          })
        })
    })
  })
}

const tokenSchemaShouldBeValid = (user) => {
  it('should have a valid token schema', (done) => {
    const schema = {
      type: 'object',
      properties: {
        user_id: { type: 'number' },
        email: { type: 'string' },
        is_admin: { type: 'boolean' },
        iat: { type: 'number' },
        exp: { type: 'number' },
      },
      required: ['user_id', 'email', 'is_admin', 'iat', 'exp'],
      additionalProperties: false,
    }
    const agent = request.agent(app)
    agent.get('/auth/login?eid=' + encodeURIComponent(user.eid)).end(() => {
      agent
        .get('/auth/token')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          const token = res.body.token
          const token_user = jwt.decode(token)
          token_user.should.be.jsonSchema(schema)
          done()
        })
    })
  })
}

const loginShouldFailOnNoEmail = (user) => {
  it('should fail on bad email', (done) => {
    const agent = request.agent(app)
    agent.get('/auth/login?eid=' + encodeURIComponent(user.eid)).end(() => {
      agent
        .get('/auth/token')
        .expect(401)
        .end((err) => {
          if (err) return done(err)
          done()
        })
    })
  })
}

const tokenShouldFailOnNoSession = () => {
  it('should not issue token without session', (done) => {
    const agent = request.agent(app)
    agent
      .get('/auth/token')
      .expect(401)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

const tokenShouldFailOnNoRole = (user) => {
  it('should not issue token without appropriate role', (done) => {
    const agent = request.agent(app)
    agent.get('/auth/login?eid=' + encodeURIComponent(user.eid)).end(() => {
      agent.get('/auth/token').expect(401).end(done)
    })
  })
}

const logoutShouldClearSession = (user) => {
  it('should clear session on logout', (done) => {
    const agent = request.agent(app)
    agent.get('/auth/login?eid=' + encodeURIComponent(user.eid)).end(() => {
      agent
        .get('/auth/token')
        .expect(200)
        .end((err) => {
          if (err) return done(err)
          agent
            .get('/auth/logout')
            .expect(302)
            .expect('Location', '/')
            .end((err) => {
              if (err) return done(err)
              agent
                .get('/auth/token')
                .expect(401)
                .end((err) => {
                  if (err) return done(err)
                  done()
                })
            })
        })
    })
  })
}


describe('/auth', () => {
  describe('user: test-admin', () => {
    const user = {
      id: 1,
      eid: "eidtest",
      email: 'test-admin@russfeld.me',
      is_admin: true,
    }

    shouldAllowLogin(user)
    tokenShouldIncludeUserData(user)
    tokenShouldBeValid(user)
    tokenSchemaShouldBeValid(user)
    loginShouldRedirectToHomepage(user)
    logoutShouldClearSession(user)
  })

  describe('user: test-api', () => {
    const user = {
      id: 3,
      eid: 'eid',
      email: 'test-api@russfeld.me',
      is_admin: false,
    }

    shouldAllowLogin(user)
    tokenShouldIncludeUserData(user)
    tokenShouldBeValid(user)
    tokenSchemaShouldBeValid(user)
    loginShouldRedirectToHomepage(user)
    logoutShouldClearSession(user)
  })

  describe('user: test-fail', () => {
    const user = {
      id: 0,
      eid: 'test',
      email: '',
      is_admin: false,
    }

    loginShouldFailOnNoEmail(user)
    tokenShouldFailOnNoSession()
  })

  describe('user: test-new', () => {
    const user = {
      id: 5,
      eid: 'anothertesteid',
      email: 'test-new@russfeld.me',
      is_admin: false,
    }

    loginShouldRedirectToHomepage(user)
    tokenShouldFailOnNoRole(user)
  })

  describe('user: test-student', () => {
    const user = {
      id: 2,
      eid: 'testeid',
      email: 'test-student@russfeld.me',
      is_admin: false,
    }

    loginShouldRedirectToHomepage(user)
    tokenShouldFailOnNoRole(user)
  })
})
