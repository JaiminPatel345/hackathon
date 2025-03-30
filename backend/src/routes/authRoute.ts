import express from 'express'
const router = express.Router()

router.post('/login', async (req, res) => {
  console.log(req.body)
})

router.post('/register', async (req, res) => {
  console.log(req.body)
})

export default router
