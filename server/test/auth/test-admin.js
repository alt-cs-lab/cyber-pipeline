//Require Shared Tests
const shared = require('./shared')

describe('test-admin /auth', function () {
  const user = {
    id: 1,
    eid: 'test-admin',
    roles: ['admin']
  }

  shared.shouldAllowLogin(user.eid)
  shared.tokenShouldIncludeUserData(user)
  shared.shouldAllowUserToRefreshToken(user.eid)
})
