import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../api/supabase'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${query}%`)
      .limit(10)

    console.log('search data:', data)
    console.log('search error:', error)

    if (!error) setResults(data)
    setLoading(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a' }}>

      {/* Nav */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid #eee'
      }}>
        <a href="/" style={{ fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '0.05em', textDecoration: 'none', color: '#1a1a1a' }}>
          NObit 🌱
        </a>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ fontWeight: 'normal', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Find someone's page
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Search by name to find a tribute wall
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name..."
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              fontFamily: 'Georgia, serif',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '0.85rem 1.5rem',
              fontSize: '1rem',
              fontFamily: 'Georgia, serif',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Search
          </button>
        </div>

        {/* Results */}
        {loading && <p style={{ color: '#666' }}>Searching...</p>}

        {!loading && searched && results.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#888',
            border: '1px dashed #ddd',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</p>
            <p>No pages found for "{query}"</p>
            <p style={{ fontSize: '0.9rem' }}>
              Want to <a href="/create-page" style={{ color: '#22c55e' }}>create a page</a> for them?
            </p>
          </div>
        )}

        {results.map(profile => (
          <div
            key={profile.id}
            onClick={() => navigate(`/profile/${profile.clerk_id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid #eee',
              marginBottom: '0.75rem',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
          >
            {/* Avatar */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              flexShrink: 0
            }}>
              {profile.full_name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{profile.full_name}</p>
              {profile.bio && (
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{profile.bio}</p>
              )}
            </div>

            <div style={{ marginLeft: 'auto', color: '#aaa', fontSize: '0.9rem' }}>
              View wall →
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}