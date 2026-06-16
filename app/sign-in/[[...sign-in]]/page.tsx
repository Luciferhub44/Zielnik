import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-dvh bg-bg-medical flex items-center justify-center pt-14 px-4">
      <SignIn />
    </div>
  )
}
