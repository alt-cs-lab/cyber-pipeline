//Require Helpers
const { loginAsAdmin } = require('../../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin /api/v1/courses', function () {
  beforeEach(loginAsAdmin)

  shared.shouldReturn200Status()
  shared.shouldReturnListOfValidCourseObjects()
  shared.shouldReturnCoursesWithValidTeacherObjects()
})