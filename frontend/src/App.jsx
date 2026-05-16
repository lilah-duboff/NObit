import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Home from './pages/Home'

export default function App() {
  return (
    <>
      <SignedIn>
        <Home />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}