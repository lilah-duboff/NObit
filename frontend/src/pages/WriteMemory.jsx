import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../api/supabase'

export default function WriteMemory() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [subjectId, setSubjectId] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!subjectId || !content) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('posts').insert({
      author_id: user.id,
      subject_id: subjectId,
      content,
    })

    if (error) {
      setError('Something went wrong, please try again')
      setLoading(false)
    } else {
      navigate(`/profile/${subjectId}`)
    }
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Write a Tribute</h1>
      <p style={{ color: 'gray', marginBottom: '2rem' }}>
        Share a memory, kind word, or positive review about someone
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Who is this about? (their user ID)
        </label>
        <input
          type="text"
          value={subjectId}
          onChange={e => setSubjectId(e.target.value)}
          placeholder="Paste their user ID here"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Your memory or tribute
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write something kind and positive..."
          rows={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
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
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Posting...' : 'Post Tribute'}
      </button>
    </div>
  )
}