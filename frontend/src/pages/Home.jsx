import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const { user } = useUser()

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
        <span style={{ fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '0.05em' }}>
          NObit 🌱
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to={`/profile/${user.id}`} style={{ color: '#555', textDecoration: 'none', fontSize: '0.9rem' }}>
            My Wall
          </Link>
          <UserButton />
        </div>
      </div>

      {/* Hero */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '5rem 2rem 3rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'normal',
          lineHeight: 1.2,
          marginBottom: '1.5rem'
        }}>
          Celebrate the people<br />you love — right now
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#555',
          lineHeight: 1.8,
          marginBottom: '1rem'
        }}>
          NObit — short for <em>No Obituary</em> — is a place to share the memories,
          kind words, and moments that make someone special.
        </p>
        <p style={{
          fontSize: '1.2rem',
          color: '#555',
          lineHeight: 1.8,
          marginBottom: '3rem'
        }}>
          Don't wait for a eulogy. Leave a tribute today.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/write" style={{
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            minWidth: '220px',
            textAlign: 'center'
          }}>
            ✍️ Leave a tribute
          </Link>

          <Link to="/create-page" style={{
            backgroundColor: 'white',
            color: '#1a1a1a',
            padding: '1rem 2rem',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            border: '2px solid #1a1a1a',
            minWidth: '220px',
            textAlign: 'center'
          }}>
            🌱 Create a page for someone
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '4rem 2rem',
        marginTop: '2rem'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 'normal', marginBottom: '3rem', fontSize: '1.75rem' }}>
            How it works
          </h2>
          <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { emoji: '🌱', title: 'Create a page', text: 'Set up a tribute page for someone you love — a friend, family member, or mentor.' },
              { emoji: '✍️', title: 'Leave a tribute', text: 'Write a memory, a kind word, or a positive review about someone in your circle.' },
              { emoji: '💚', title: 'Celebrate them', text: 'Their page becomes a living collection of love and gratitude, shared while they can enjoy it.' },
            ].map(({ emoji, title, text }) => (
              <div key={title} style={{ maxWidth: '200px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{emoji}</div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1rem' }}>{title}</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#aaa',
        fontSize: '0.85rem'
      }}>
        NObit — because the best tributes are shared while people can still hear them 🌱
      </div>

    </div>
  )
}