import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../api/supabase'
import { themes } from '../config/themes'

export default function Profile() {
  const { userId } = useParams()
  const { user, isSignedIn, isLoaded } = useUser()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedPosts, setExpandedPosts] = useState({})

  const theme = profile?.color_theme ? themes[profile.color_theme] : themes.green
  const isOwner = isSignedIn && profile?.created_by === user?.id

  useEffect(() => {
    async function fetchData() {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_id', userId)
        .single()

      setProfile(profileData)

      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .eq('subject_id', userId)
        .order('created_at', { ascending: false })

      console.log('posts:', postsData, 'error:', error)
      if (postsData) setPosts(postsData)
      setLoading(false)
    }

    fetchData()
  }, [userId])

  function toggleExpand(postId) {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  async function handleDelete(postId) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (!error) setPosts(posts.filter(p => p.id !== postId))
  }

  const TRUNCATE_LENGTH = 180
  
  if (!isLoaded) return null
  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a', minHeight: '100vh', backgroundColor: theme.background }}>

      {/* Nav */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        borderBottom: `1px solid ${theme.border}`,
        backgroundColor: 'white'
      }}>
        <a href="/" style={{ fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none', color: '#1a1a1a' }}>
          NObit 🌱
        </a>
        <button
          onClick={() => navigate(`/write/${userId}`)}
          style={{
            backgroundColor: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.25rem',
            fontFamily: 'Georgia, serif',
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ✍️ Leave a tribute
        </button>
      </div>

      {/* Profile header */}
      <div style={{
        backgroundColor: theme.card,
        borderBottom: `1px solid ${theme.border}`,
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        {/* Avatar */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: theme.primary,
          border: `3px solid ${theme.border}`,
          margin: '0 auto 1rem',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          color: 'white'
        }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (profile?.full_name?.charAt(0).toUpperCase() || '🌱')
          }
        </div>

        <h1 style={{ fontWeight: 'normal', fontSize: '2rem', margin: '0 0 0.25rem' }}>
          {profile?.full_name || 'Tribute Wall'}
        </h1>

        {(profile?.birth_year || profile?.death_year) && (
          <p style={{ color: theme.text, opacity: 0.6, margin: '0 0 0.75rem', fontSize: '0.95rem' }}>
            {profile.birth_year && profile.birth_year}
            {profile.birth_year && profile.death_year && ' – '}
            {profile.death_year && profile.death_year}
          </p>
        )}

        {profile?.bio && (
          <p style={{
            maxWidth: '520px',
            margin: '0 auto',
            color: theme.text,
            opacity: 0.8,
            lineHeight: 1.7,
            fontSize: '1rem'
          }}>
            {profile.bio}
          </p>
        )}

        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: theme.text, opacity: 0.5 }}>
          {posts.length} {posts.length === 1 ? 'tribute' : 'tributes'}
        </p>
      </div>

      {/* Posts grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {loading && <p style={{ textAlign: 'center', color: '#888' }}>Loading tributes...</p>}

        {!loading && posts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#888',
            border: `2px dashed ${theme.border}`,
            borderRadius: '16px'
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌱</p>
            <p style={{ marginBottom: '1rem' }}>No tributes yet — be the first to write one!</p>
            <button
              onClick={() => navigate(`/write/${userId}`)}
              style={{
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontFamily: 'Georgia, serif',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              ✍️ Write a tribute
            </button>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {posts.map(post => {
            const isLong = post.content.length > TRUNCATE_LENGTH
            const isExpanded = expandedPosts[post.id]

            return (
              <div
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}
              >
                {/* Post photo */}
                {post.photo_url && (
                  <img
                    src={post.photo_url}
                    alt="tribute"
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }}
                  />
                )}

                {/* Content */}
                <p style={{
                  margin: 0,
                  lineHeight: 1.7,
                  fontSize: '0.97rem',
                  color: '#1a1a1a'
                }}>
                  {isLong && !isExpanded
                    ? post.content.slice(0, TRUNCATE_LENGTH) + '...'
                    : post.content
                  }
                </p>

                {/* Expand / collapse */}
                {isLong && (
                  <button
                    onClick={() => toggleExpand(post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.primary,
                      cursor: 'pointer',
                      fontFamily: 'Georgia, serif',
                      fontSize: '0.88rem',
                      padding: 0,
                      textAlign: 'left'
                    }}
                  >
                    {isExpanded ? '↑ Show less' : '↓ Read more'}
                  </button>
                )}

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '0.5rem',
                  borderTop: `1px solid ${theme.border}`
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: '#444' }}>
                      {post.is_anonymous ? 'Anonymous' : (post.author_name || 'Someone special')}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#aaa' }}>
                      {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        background: 'none',
                        border: '1px solid #fca5a5',
                        color: '#ef4444',
                        borderRadius: '6px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        fontFamily: 'Georgia, serif'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}