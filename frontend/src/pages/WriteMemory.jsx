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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!content.trim()) {
      setError('Please write something before posting')
      return
    }

    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('posts').insert({
      subject_id: userId,
      content,
      is_anonymous: isAnonymous,
      author_name: isAnonymous ? null : (isSignedIn ? user.fullName : authorName),
      author_id: isSignedIn ? user.id : null
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

        {/* Author name — only show if not signed in */}
        {!isSignedIn && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Your name <span style={{ color: '#aaa', fontWeight: 'normal', fontSize: '0.85rem' }}>(optional)</span>
            </label>
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Leave blank to post anonymously"
              disabled={isAnonymous}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                fontFamily: 'Georgia, serif',
                boxSizing: 'border-box',
                opacity: isAnonymous ? 0.4 : 1
              }}
            />
          </div>
        )}

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
        <div style={{ marginBottom: '2rem' }}>
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