const { AsyncLocalStorage } = require('node:async_hooks')

const asyncLocalStorage = new AsyncLocalStorage()

/* Store User eID in Async Storage for DB Operations */
async function dbAudit(req, res, next) {
  asyncLocalStorage.run(req.user_eid, () => {
    next()
  })
}

module.exports = {
  dbAudit: dbAudit,
  asyncLocalStorage: asyncLocalStorage,
}
