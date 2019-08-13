const Dev = require('../models/Dev')

module.exports = {
  async store (req, res) {
    const { devId } = req.params
    const { userid } = req.headers

    const loggedDev = await Dev.findById(userid)
    const targetDev = await Dev.findById(devId)

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' })
    }

    if (targetDev.likes.includes(userid)) {
      const loggedSocket = req.connectedUsers[userid]
      const targetSocket = req.connectedUsers[devId]

      if (loggedSocket) {
        req.io.to(loggedSocket).emit('match', targetDev)
      }

      if (targetSocket) {
        req.io.to(targetSocket).emit('match', loggedDev)
      }
    }

    loggedDev.likes.push(targetDev._id)

    await loggedDev.save()
    return res.json(loggedDev)
  }
}
