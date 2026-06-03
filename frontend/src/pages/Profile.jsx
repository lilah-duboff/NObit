import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../api/supabase'

export default function Profile() {
  const { userId } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('subject_id', userId)
        .order('created_at', { ascending: false })

      console.log('userId:', userId)
      console.log('data:', data)
      console.log('error:', error)

      if (!error) setPosts(data)
      setLoading(false)
    }

    fetchPosts()
  }, [userId])

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Tribute Wall</h1>
      <p style={{ color: 'gray', marginBottom: '2rem' }}>
        Memories and kind words written about this person
      </p>

      {loading && <p>Loading...</p>}

      {!loading && posts.length === 0 && (
        <p>No tributes yet — be the first to write one!</p>
      )}

      {posts.map(post => (
        <div key={post.id} style={{
          border: '1px solid #eee',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: 0 }}>{post.content}</p>
          <p style={{ fontSize: '12px', color: 'gray', marginTop: '0.5rem' }}>
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}