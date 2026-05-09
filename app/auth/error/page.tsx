import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-center p-4 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Authentication Error</h1>
      </header>

      <main className="flex-1 flex items-start justify-center p-4 pt-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Something Went Wrong</CardTitle>
            <CardDescription>
              There was an error during authentication. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login" className="block">
              <Button className="w-full">
                Back to Login
              </Button>
            </Link>
            <Link href="/auth/sign-up" className="block">
              <Button variant="outline" className="w-full">
                Create New Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
