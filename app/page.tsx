import { redirect } from 'next/navigation'

export default function RootPage() {
  // Middleware handles the redirect based on auth status
  // This is a fallback
  redirect('/auth/login')
}
