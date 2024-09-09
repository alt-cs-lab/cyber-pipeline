//Require Shared Tests
const shared = require('./shared')

describe('alwhipple', function () {
    const user = {
      id: 2,
      eid: 'alwhipple',
      is_admin: false,
    }
  
    shared.shouldAllowLogin(user.eid)
    shared.tokenShouldIncludeUserData(user)
    shared.shouldAllowUserToRefreshToken(user.eid)
  })