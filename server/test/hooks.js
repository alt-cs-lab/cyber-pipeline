import 'dotenv/config'

//Require app dependencies
import db from '../configs/db.js'

// Set up environment variables
process.env.FORCE_AUTH = 'true'

// Root Hook Runs Before Each Test
const mochaHooks = {
  beforeAll(done) {
    // Run migrations
    try {
    await db.migrate.latest().then(function () {
      done()
    })
    } catch (error) {
      console.error("Migration failed:", error);
      throw error; // Re-throw to fail the tests
    }
},

  beforeEach(done) {
    // Seed the database
    db.seed.run().then(function () {
      done()
    })
  },
}

export { mochaHooks }