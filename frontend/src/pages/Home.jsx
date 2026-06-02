import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const { user } = useUser()

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>NObit 🌱</h1>
        <UserButton />
      </div>

      <Link to={`/profile/${user.id}`}>
        View my tribute wall →
      </Link>
      <br /><br />
      <Link to="/write">Write a tribute about someone →
      </Link>
    </div>
  )
}