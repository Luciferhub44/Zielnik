import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-dvh bg-bg-medical flex items-center justify-center pt-14 px-4">
      <SignUp />
    </div>
  )
}
