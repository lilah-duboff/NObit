import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Search from './pages/Search'
import WriteMemory from './pages/WriteMemory'
import CreatePage from './pages/CreatePage'

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/write/:userId" element={<WriteMemory />} />
        <Route path="/create-page" element={
          <ProtectedRoute><CreatePage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}