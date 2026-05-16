import { UserButton } from '@clerk/clerk-react'

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome to NObit 🌱</h1>
        <UserButton />
      </div>
      <p>Your tribute feed will appear here.</p>
    </div>
  )
}