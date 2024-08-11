/* Check if User is Admin */
async function adminOnly(req, res, next) {
  if (req.roles.includes('admin')) {
    next()
  } else {
    res.status(403)
    res.json({ error: 'Admins Only' })
  }
}

module.exports = adminOnly
