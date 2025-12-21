import express from 'express'
import { generateImages } from '../controller/imageController.js'
import { suggestPrompts, generateDescription } from '../controller/promptController.js'
import adminAuth from '../middleware/adminAuth.js'

const imageRoutes = express.Router()

// use auth to avoid abuse; can relax if needed
imageRoutes.post('/generate', adminAuth, generateImages)
imageRoutes.post('/prompts', adminAuth, suggestPrompts)
imageRoutes.post('/description', adminAuth, generateDescription)

export default imageRoutes
