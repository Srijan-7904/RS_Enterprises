import axios from 'axios'

export const suggestPrompts = async (req, res) => {
  try {
    const { topic = 'camera product photo', count = 5 } = req.body || {}
    const num = Math.min(Number(count) || 5, 10)

    const key = process.env.GEMINI_API_KEY
    if (!key) {
      // Fallback: static suggestions when Gemini key not present
      const presets = [
        'Studio shot of a black IR camera on soft gray backdrop, soft shadows, high detail',
        'Lifestyle photo: camera on wooden desk near laptop, natural window light, shallow depth of field',
        'Isometric hero shot, clean white background, subtle reflection, soft shadow',
        'Flat lay composition with camera, lens cap, and cables, minimal props, even lighting',
        'Product on colored paper backdrop (teal), rim light, crisp edges, catalog style'
      ]
      return res.status(200).json({ 
        prompts: presets.slice(0, num),
        isAI: false,
        info: 'Get free Gemini API key at https://aistudio.google.com/app/apikey'
      })
    }

    // Gemini text-only prompt suggestions
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`
    const sys = `You are a product photography prompt generator. Generate ${num} concise, high-quality prompts for ${topic}. Each 12-20 words. Focus on lighting, background, style, and composition. No numbered list, just one prompt per line.`

    const { data } = await axios.post(url, {
      contents: [
        { role: 'user', parts: [{ text: sys }] }
      ]
    }, { timeout: 20000 })

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const lines = text
      .split('\n')
      .map(x => x.replace(/^\s*[-*0-9.]+\s*/, '').trim())
      .filter(Boolean)
    if (!lines.length) {
      return res.status(200).json({ 
        prompts: [
          'Clean studio shot on white, soft shadow, high detail, centered composition',
          'Lifestyle scene on desk near laptop, morning light, shallow depth of field'
        ].slice(0, num),
        isAI: true
      })
    }
    return res.status(200).json({ prompts: lines.slice(0, num), isAI: true })
  } catch (err) {
    console.log('Prompt suggest error:', err?.response?.data || err.message)
    return res.status(500).json({ message: 'Prompt suggestion error', details: err?.response?.data || err.message })
  }
}

export const generateDescription = async (req, res) => {
  try {
    const { productInfo = '' } = req.body || {}
    if (!productInfo.trim()) {
      return res.status(400).json({ message: 'Product info is required' })
    }

    const key = process.env.GEMINI_API_KEY
    if (!key) {
      // Fallback: basic template description
      const words = productInfo.trim().split(/\s+/).slice(0, 15)
      const fallback = `${words.join(' ')}. Professional quality camera equipment designed for optimal performance and reliability in various conditions.`
      return res.status(200).json({ 
        description: fallback.slice(0, 200),
        isAI: false,
        info: 'Get free Gemini API key at https://aistudio.google.com/app/apikey'
      })
    }

    // Gemini text generation
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`
    const prompt = `Write a compelling 30-50 word product description for an e-commerce camera store based on this information: ${productInfo}. Focus on key features, benefits, and quality. Write in a professional, concise style. Do not use markdown or bullet points.`

    const { data } = await axios.post(url, {
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ]
    }, { timeout: 20000 })

    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
    if (!description) {
      const words = productInfo.trim().split(/\s+/).slice(0, 15)
      const fallback = `${words.join(' ')}. Professional quality camera equipment designed for optimal performance and reliability.`
      return res.status(200).json({ description: fallback.slice(0, 200), isAI: true })
    }

    return res.status(200).json({ description, isAI: true })
  } catch (err) {
    console.log('Description generation error:', err?.response?.data || err.message)
    return res.status(500).json({ message: 'Description generation error', details: err?.response?.data || err.message })
  }
}
