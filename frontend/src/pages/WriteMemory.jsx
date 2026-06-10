import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../api/supabase'

export default function WriteMemory() {
  const { userId } = useParams()
  const { user, isSignedIn } = useUser()
  const navigate = useNavigate()

  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!content.trim()) {
      setError('Please write something before posting')
      return
    }

    setLoading(true)
    setError('')

    let photoUrl = null

    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('tribute-photos')
        .upload(fileName, photoFile)

      if (uploadError) {
        setError('Photo upload failed, please try again')
        console.error(uploadError)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('tribute-photos')
        .getPublicUrl(fileName)

      photoUrl = urlData.publicUrl
    }

    const { error: insertError } = await supabase.from('posts').insert({
      subject_id: userId,
      content,
      is_anonymous: isAnonymous,
      author_name: isAnonymous ? null : (isSignedIn ? user.fullName : authorName),
      author_id: isSignedIn ? user.id : null,
      photo_url: photoUrl
    })

    if (insertError) {
      setError('Something went wrong, please try again')
      console.error(insertError)
      setLoading(false)
      return
    }

    navigate(`/profile/${userId}`)
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a' }}>

      {/* Nav */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid #eee',
        backgroundColor: 'white'
      }}>
        <a href="/" style={{ fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none', color: '#1a1a1a' }}>
          NObit 🌱
        </a>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ fontWeight: 'normal', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Leave a tribute
        </h1>
        <p style={{ color: '#666', marginBottom: '2.5rem' }}>
          Share a memory, kind word, or positive review
        </p>

        {/* Author name */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
          Your name <span style={{ color: '#aaa', fontWeight: 'normal', fontSize: '0.85rem' }}>(optional)</span>
        </label>
        <input
          type="text"
          value={isSignedIn ? (isAnonymous ? '' : user.fullName) : authorName}
          onChange={e => !isSignedIn && setAuthorName(e.target.value)}
          placeholder={isAnonymous ? 'Posting anonymously' : 'Your name'}
          disabled={isAnonymous || isSignedIn}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            fontFamily: 'Georgia, serif',
            boxSizing: 'border-box',
            opacity: isAnonymous ? 0.4 : 1,
            backgroundColor: isSignedIn ? '#f9f9f9' : 'white'
          }}
        />
        {isSignedIn && !isAnonymous && (
          <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.4rem' }}>
            Your name will appear on the tribute as it appears in your account
          </p>
        )}
      </div>

        {/* Anonymous toggle */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="anon"
            checked={isAnonymous}
            onChange={e => setIsAnonymous(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="anon" style={{ cursor: 'pointer', color: '#555' }}>
            Post anonymously
          </label>
        </div>

        {/* Tribute content */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Your tribute <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write something kind and positive..."
            rows={6}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              fontFamily: 'Georgia, serif',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Photo upload */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Add a photo <span style={{ color: '#aaa', fontWeight: 'normal', fontSize: '0.85rem' }}>(optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            id="tribute-photo"
            style={{ display: 'none' }}
          />
          {!photoPreview ? (
            <label htmlFor="tribute-photo" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1.5rem',
              borderRadius: '10px',
              border: '2px dashed #ddd',
              cursor: 'pointer',
              color: '#aaa',
              fontSize: '0.95rem'
            }}>
              📷 Click to add a photo
            </label>
          ) : (
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <img
                src={photoPreview}
                alt="preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid #eee'
                }}
              />
              <button
                onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            width: '100%'
          }}
        >
          {loading ? 'Posting...' : '💚 Post tribute'}
        </button>
      </div>
    </div>
  )
}