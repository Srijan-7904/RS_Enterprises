import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'

const promptIdeas = [
  "High-contrast product shot on white background",
  "Isometric hero shot with soft shadow",
  "Lifestyle photo: product on desk near laptop",
  "Flat lay with minimal props and soft light",
  "Studio shot with colored backdrop and rim light"
]

const placeholderImages = [
  {
    title: 'Hero Camera Shot',
    url: 'https://images.unsplash.com/photo-1502920917128-1aa500764b8a?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Desk Lifestyle',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Studio Backdrop',
    url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80'
  }
]

function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [suggested, setSuggested] = useState([])
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [suggestError, setSuggestError] = useState("")
  
  const [descInput, setDescInput] = useState("")
  const [descOutput, setDescOutput] = useState("")
  const [descLoading, setDescLoading] = useState(false)
  const [descError, setDescError] = useState("")

  const previews = useMemo(() => files.map(file => ({
    name: file.name,
    url: URL.createObjectURL(file)
  })), [files])

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, 3)
    setFiles(selected)
  }

  const { serverUrl } = useContext(authDataContext)

  const handleSuggest = async () => {
    setSuggestError("")
    setSuggestLoading(true)
    try {
      const { data } = await axios.post(
        serverUrl + '/api/image/prompts',
        { topic: 'camera product photo', count: 6 },
        { withCredentials: true }
      )
      const newPrompts = Array.isArray(data?.prompts) ? data.prompts : []
      setSuggested(newPrompts)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not fetch suggestions.'
      setSuggestError(msg)
    } finally {
      setSuggestLoading(false)
    }
  }

  const handleGenerateDesc = async () => {
    setDescError("")
    setDescOutput("")
    if (!descInput.trim()) {
      setDescError("Enter product information to generate description.")
      return
    }
    setDescLoading(true)
    try {
      const { data } = await axios.post(
        serverUrl + '/api/image/description',
        { productInfo: descInput },
        { withCredentials: true }
      )
      setDescOutput(data?.description || '')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Description generation failed.'
      setDescError(msg)
    } finally {
      setDescLoading(false)
    }
  }

  const handleGenerate = async () => {
    setError("")
    if (!prompt.trim()) {
      setError("Enter a prompt to generate images.")
      return
    }
    if (files.length === 0) {
      setError("Add at least one reference image (max 3).")
      return
    }

    setLoading(true)
    try {
      // Call backend image generator (Stable Horde anonymous)
      const { data } = await axios.post(
        serverUrl + '/api/image/generate',
        { prompt, count },
        { withCredentials: true }
      )

      if (data?.images?.length) {
        const imgResults = data.images.map((g, i) => ({
          title: `Generated #${i+1}`,
          url: `data:image/png;base64,${g.img}`
        }))
        setResults(imgResults)
      } else {
        setError('No images returned. Try again later.')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Generation failed.'
      const details = err?.response?.data?.details ? JSON.stringify(err.response.data.details).slice(0, 200) : ''
      setError(details ? `${msg}: ${details}` : msg)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setPrompt("")
    setFiles([])
    setResults([])
    setError("")
  }

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] text-[#0a5f7a] overflow-x-hidden'>
      <Nav />
      <Sidebar />

      <div className='w-[82%] ml-[18%] pt-[90px] pb-[60px] px-[24px] md:px-[48px] flex flex-col gap-6'>
        <div className='flex items-center justify-between flex-wrap gap-3'>
          <div>
            <h1 className='text-[30px] md:text-[38px] font-semibold text-[#0a5f7a]'>Product Image Generator Hub</h1>
            <p className='text-[15px] md:text-[17px] text-[#5a8899]'>
              Upload 1-3 refs + prompt, then generate 4 variants (placeholder until API is wired). 
              <a 
                href='https://gemini.google.com/' 
                target='_blank' 
                rel='noreferrer'
                className='text-[#1488aa] underline ml-1'
              >
                Try Gemini
              </a>
            </p>
          </div>
          <button
            className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white px-4 py-2 rounded-lg text-[14px] hover:opacity-80 active:opacity-90 font-semibold'
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        <section className='bg-white border-2 border-[#b8dce8] rounded-xl p-5 flex flex-col gap-4 shadow-sm'>
          <h2 className='text-[20px] md:text-[24px] font-semibold text-[#0a5f7a]'>Reference images</h2>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleFiles}
            className='text-[14px] text-[#0a5f7a]'
          />
          <p className='text-[13px] text-[#5a8899]'>Add up to 3 images. These guide the style/look. (Currently local preview only.)</p>
          {previews.length > 0 && (
            <div className='grid sm:grid-cols-3 gap-3'>
              {previews.map((p, idx) => (
                <div key={idx} className='bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-lg p-2'>
                  <img src={p.url} alt={p.name} className='w-full h-[140px] object-cover rounded-md' />
                  <p className='text-[12px] mt-1 truncate text-[#0a5f7a]'>{p.name}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className='bg-white border-2 border-[#b8dce8] rounded-xl p-5 flex flex-col gap-3 shadow-sm'>
          <h2 className='text-[20px] md:text-[24px] font-semibold text-[#0a5f7a]'>Prompt</h2>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}
            placeholder='e.g. Studio shot of a black IR camera on a soft gray backdrop, soft shadows, high detail'
            className='bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-lg p-3 text-[14px] text-[#0a5f7a] outline-none focus:border-[#1488aa] placeholder:text-[#5a8899]'
          />
          {error && <p className='text-[13px] text-red-500'>{error}</p>}
          <div className='flex items-center gap-3'>
            <label className='text-[13px] text-[#5a8899]'>Images to generate:</label>
            <select
              className='bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-md px-2 py-1 text-[13px] text-[#0a5f7a]'
              value={count}
              onChange={(e)=>setCount(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          <button
            className='w-fit bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white px-5 py-2 rounded-lg text-[15px] hover:opacity-80 active:opacity-90 disabled:opacity-60 font-semibold'
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : `Generate ${count} image${count>1?'s':''}`}
          </button>
          <p className='text-[12px] text-[#5a8899]'>Powered by free Stable Horde (anonymous). Generation may take up to ~90s.</p>
        </section>

        <section className='bg-white border-2 border-[#b8dce8] rounded-xl p-5 flex flex-col gap-4 shadow-sm'>
          <h2 className='text-[20px] md:text-[24px] font-semibold text-[#0a5f7a]'>Results</h2>
          {results.length === 0 && (
            <p className='text-[14px] text-[#5a8899]'>No results yet. Add refs + prompt and click Generate.</p>
          )}
          {results.length > 0 && (
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {results.map((img, idx) => (
                <div key={idx} className='bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-lg p-2 flex flex-col gap-2'>
                  <img src={img.url} alt={img.title} className='w-full h-[160px] object-cover rounded-md' />
                  <p className='text-[13px] text-[#0a5f7a]'>{img.title}</p>
                  <a
                    href={img.url}
                    target='_blank'
                    rel='noreferrer'
                    className='text-center text-[13px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white rounded-md py-2 hover:opacity-80 active:opacity-90 font-semibold'
                  >
                    Open / Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className='mb-4 bg-white border-2 border-[#b8dce8] rounded-xl p-5 shadow-sm'>
          <div className='flex items-center justify-between mb-3 gap-3'>
            <h2 className='text-[20px] md:text-[24px] font-semibold text-[#0a5f7a]'>Prompt ideas</h2>
            <button
              className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white px-3 py-1.5 rounded-md text-[13px] hover:opacity-80 active:opacity-90 disabled:opacity-60 font-semibold'
              onClick={handleSuggest}
              disabled={suggestLoading}
            >
              {suggestLoading ? 'Inspiring…' : 'Inspire me (AI)'}
            </button>
          </div>
          {suggestError && (
            <p className='text-[12px] text-red-500 mb-2'>{suggestError}</p>
          )}
          <div className='grid md:grid-cols-2 gap-3'>
            {(suggested.length ? suggested : promptIdeas).map((p, idx) => (
              <button
                key={idx}
                type='button'
                onClick={() => setPrompt(p)}
                className='text-left bg-[#f5f9fc] border-2 border-[#b8dce8] hover:border-[#1488aa] rounded-lg px-3 py-3 text-[15px] text-[#0a5f7a]'
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        <section className='mb-4 bg-white border-2 border-[#b8dce8] rounded-xl p-5 shadow-sm'>
          <h2 className='text-[20px] md:text-[24px] font-semibold mb-3 text-[#0a5f7a]'>Product Description Maker</h2>
          <p className='text-[13px] text-[#5a8899] mb-3'>Enter product details and generate a 30-50 word description.</p>
          <textarea
            rows={3}
            value={descInput}
            onChange={(e)=>setDescInput(e.target.value)}
            placeholder='e.g. 4MP IR Camera, 2.8mm lens, night vision up to 30m, IP67 weatherproof, PoE'
            className='w-full bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-lg p-3 text-[14px] text-[#0a5f7a] outline-none mb-3 focus:border-[#1488aa] placeholder:text-[#5a8899]'
          />
          <button
            className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white px-4 py-2 rounded-lg text-[14px] hover:opacity-80 active:opacity-90 disabled:opacity-60 mb-3 font-semibold'
            onClick={handleGenerateDesc}
            disabled={descLoading}
          >
            {descLoading ? 'Generating...' : 'Generate Description'}
          </button>
          {descError && (
            <p className='text-[12px] text-red-500 mb-2'>{descError}</p>
          )}
          {descOutput && (
            <div className='bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-lg p-4'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-[13px] font-semibold text-[#1488aa]'>Generated Description:</p>
                <button
                  className='text-[12px] text-[#1488aa] underline'
                  onClick={() => navigator.clipboard.writeText(descOutput)}
                >
                  Copy
                </button>
              </div>
              <p className='text-[14px] text-[#0a5f7a]'>{descOutput}</p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default ImageGenerator
