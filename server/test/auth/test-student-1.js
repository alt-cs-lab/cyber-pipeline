//Require Shared Tests
const shared = require('./shared')

describe('test-student-1 /auth', function () {
  const user = {
    id: 3,
    eid: 'test-student',
    roles: ['user']
  }

  shared.shouldAllowLogin(user.eid)
  shared.tokenShouldIncludeUserData(user)
  shared.shouldAllowUserToRefreshToken(user.eid)
})
