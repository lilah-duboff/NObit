import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import WriteMemory from './pages/WriteMemory'
import CreatePage from './pages/CreatePage'

export default function App() {
  return (
    <BrowserRouter>
      <SignedIn>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/write" element={<WriteMemory />} />
          <Route path="/create-page" element={<CreatePage />} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </BrowserRouter>
  )
}