const Dev = require('../models/Dev')

module.exports = {
  async store (req, res) {
    const { devId } = req.params
    const { userid } = req.headers

    const loggedDev = await Dev.findById(userid)
    const targetDev = await Dev.findById(devId)

    if (!userid) {
      return res.status(400).json({ error: 'User not exists' })
    }

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' })
    }

    loggedDev.dislikes.push(targetDev._id)

    await loggedDev.save()

    return res.json(loggedDev)
  }
}
