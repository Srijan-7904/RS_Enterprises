import axios from 'axios'

// Simple Stable Horde integration using anonymous key (low priority)
// Docs: https://stablehorde.net/

export const generateImages = async (req, res) => {
  try {
    const { prompt, count = 4 } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // If Replicate token is present, prefer Replicate provider
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (replicateToken) {
      const n = Math.min(Number(count) || 1, 4);
      // Use latest model via model endpoint (no version hardcoding)
      const modelOwner = process.env.REPLICATE_MODEL_OWNER || 'black-forest-labs'
      const modelName = process.env.REPLICATE_MODEL_NAME || 'flux-schnell'

      const create = await axios.post(
        `https://api.replicate.com/v1/models/${modelOwner}/${modelName}/predictions`,
        {
          input: {
            prompt,
            num_outputs: n,
            // common knobs; models ignore unknown fields
            guidance: 3,
            width: 768,
            height: 768,
          }
        },
        {
          headers: {
            'Authorization': `Token ${replicateToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      )

      const pid = create?.data?.id;
      if (!pid) {
        return res.status(500).json({ message: 'Failed to create Replicate prediction', details: create?.data || null })
      }

      const started = Date.now();
      let output = [];
      while (Date.now() - started < 90000) {
        await new Promise(r => setTimeout(r, 2500));
        const status = await axios.get(
          `https://api.replicate.com/v1/predictions/${pid}`,
          { headers: { 'Authorization': `Token ${replicateToken}` }, timeout: 15000 }
        )
        const st = status?.data?.status;
        if (st === 'succeeded') {
          output = status?.data?.output || [];
          break;
        }
        if (st === 'failed' || st === 'canceled') {
          return res.status(500).json({ message: `Replicate ${st}`, details: status?.data || null })
        }
      }

      if (!output?.length) {
        return res.status(504).json({ message: 'Replicate timeout. Try again.' })
      }

      // Replicate returns array of URLs
      const images = output.map((url) => ({ img: url }))
      return res.status(200).json({ images })
    }

    // Fallback to Stable Horde if Replicate not configured
    const apiKey = process.env.STABLE_HORDE_API_KEY || '0000000000'; // anonymous

    const createResp = await axios.post(
      'https://stablehorde.net/api/v2/generate/async',
      {
        prompt,
        params: {
          sampler_name: 'k_euler',
          cfg_scale: 7,
          steps: 25,
          width: 512,
          height: 512,
          n: Math.min(Number(count) || 4, 4),
          karras: true,
          tiling: false,
          nsfw: false,
        },
        // Prefer SDXL capable workers
        models: ['SDXL 1.0'],
        // Do not force trusted workers to increase availability
        // trusted_workers: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey,
        },
        timeout: 30000,
      }
    );

    const jobId = createResp?.data?.id;
    if (!jobId) {
      return res.status(500).json({ message: 'Failed to create generation job', details: createResp?.data || 'no-id' });
    }

    // Poll for completion (simple loop, max ~60s)
    const started = Date.now();
    let images = [];
    while (Date.now() - started < 90000) {
      // Reduce polling frequency to avoid hitting rate limits
      await new Promise(r => setTimeout(r, 6000));
      const statusResp = await axios.get(`https://stablehorde.net/api/v2/generate/status/${jobId}`, {
        headers: { 'apikey': apiKey },
        timeout: 20000,
      });
      const status = statusResp.data?.state;
      if (status === 'finished') {
        images = (statusResp.data?.generations || []).map(g => ({
          img: g.img, // base64
          seed: g.seed,
        }));
        break;
      }
      if (status === 'faulted') {
        return res.status(500).json({ message: 'Generation faulted', details: statusResp?.data || null });
      }
    }

    if (!images.length) {
      return res.status(504).json({ message: 'Generation timeout. Free queue is busy. Try again or ensure your API key is set.' });
    }

    // Return base64 images
    return res.status(200).json({ images });
  } catch (error) {
    const payload = error?.response?.data || { message: error.message };
    console.log('Horde error:', payload);
    return res.status(500).json({ message: 'Image generation error', details: payload });
  }
}
