import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../api/supabase'
import { themes } from '../config/themes'

export default function CreatePage() {
  const { user } = useUser()
  const navigate = useNavigate()

  const [forSelf, setForSelf] = useState(true)
  const [fullName, setFullName] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [deathYear, setDeathYear] = useState('')
  const [bio, setBio] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('green')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const theme = themes[selectedTheme]

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!fullName.trim()) {
      setError('Please enter a name')
      return
    }

    setLoading(true)
    setError('')

    let avatarUrl = null

    // Upload photo to Supabase storage if provided
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile)

      if (uploadError) {
        setError('Photo upload failed, please try again')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      avatarUrl = urlData.publicUrl
    }

    const profileData = {
    clerk_id: forSelf ? user.id : `external-${Date.now()}`,
    full_name: fullName,
    birth_year: birthYear || null,
    death_year: deathYear || null,
    bio: bio || null,
    avatar_url: avatarUrl,
    color_theme: selectedTheme,
    created_by: user.id
    }

    const { data, error: insertError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (insertError) {
      setError('Something went wrong, please try again')
      console.error(insertError)
      setLoading(false)
      return
    }

    navigate(`/profile/${data.clerk_id}`)
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a', minHeight: '100vh', backgroundColor: theme.background, transition: 'background 0.3s' }}>

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
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ fontWeight: 'normal', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Create a tribute page
        </h1>
        <p style={{ color: '#666', marginBottom: '2.5rem' }}>
          Build a living page of memories and kind words
        </p>

        {/* For self or someone else */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.75rem' }}>
            Who is this page for?
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[{ val: true, label: '🙋 Myself' }, { val: false, label: '💚 Someone else' }].map(({ val, label }) => (
              <button
                key={label}
                onClick={() => setForSelf(val)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: `2px solid ${forSelf === val ? theme.primary : '#ddd'}`,
                  backgroundColor: forSelf === val ? theme.card : 'white',
                  color: forSelf === val ? theme.text : '#666',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.95rem',
                  fontWeight: forSelf === val ? 'bold' : 'normal'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo upload */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.75rem' }}>
            Photo
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: theme.card,
              border: `2px dashed ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '1.75rem' }}>🌱</span>
              }
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                id="avatar-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="avatar-upload" style={{
                backgroundColor: theme.primary,
                color: 'white',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'inline-block'
              }}>
                Upload photo
              </label>
              <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.4rem' }}>JPG or PNG recommended</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Full name <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="e.g. Margaret Johnson"
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: `1px solid ${theme.border}`,
              fontSize: '1rem',
              fontFamily: 'Georgia, serif',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
          />
        </div>

        {/* Years */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Birth year
            </label>
            <input
              type="text"
              value={birthYear}
              onChange={e => setBirthYear(e.target.value)}
              placeholder="e.g. 1942"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                fontSize: '1rem',
                fontFamily: 'Georgia, serif',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Death year <span style={{ color: '#aaa', fontWeight: 'normal', fontSize: '0.85rem' }}>(optional)</span>
            </label>
            <input
              type="text"
              value={deathYear}
              onChange={e => setDeathYear(e.target.value)}
              placeholder="Leave blank if living"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                fontSize: '1rem',
                fontFamily: 'Georgia, serif',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Bio
          </label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="A short description of this person — who they are, what they love, what makes them special..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: `1px solid ${theme.border}`,
              fontSize: '1rem',
              fontFamily: 'Georgia, serif',
              boxSizing: 'border-box',
              resize: 'vertical',
              backgroundColor: 'white'
            }}
          />
        </div>

        {/* Color theme */}
        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.75rem' }}>
            Page theme
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setSelectedTheme(key)}
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '20px',
                  border: `2px solid ${selectedTheme === key ? t.primary : '#ddd'}`,
                  backgroundColor: selectedTheme === key ? t.card : 'white',
                  color: selectedTheme === key ? t.text : '#666',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.9rem',
                  fontWeight: selectedTheme === key ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.75rem' }}>
            The page background updates as you pick a theme ☝️
          </p>
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: theme.primary,
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
          {loading ? 'Creating page...' : '🌱 Create tribute page'}
        </button>
      </div>
    </div>
  )
}