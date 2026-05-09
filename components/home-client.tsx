'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, User, FileText, LogOut, Cog } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/types'
import { OPERATIONS } from '@/lib/operations-config'

interface HomeClientProps {
  profile: Profile | null
}

export default function HomeClient({ profile }: HomeClientProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Cog className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Light Process</h1>
            <p className="text-xs text-muted-foreground">Manufacturing Ops</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={profile?.profile_image_pathname || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/studies" className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Saved Studies
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="p-4 pb-2">
        <h2 className="text-xl font-semibold text-foreground">
          Welcome, {profile?.full_name?.split(' ')[0] || 'User'}
        </h2>
        <p className="text-sm text-muted-foreground">Select an operation to begin</p>
      </div>

      {/* Operations Grid */}
      <main className="flex-1 p-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          {OPERATIONS.map((operation) => (
            <Link key={operation.type} href={`/operation/${operation.type}`}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                <CardContent className="flex flex-col items-center justify-center p-4 min-h-[140px]">
                  <div className={`w-14 h-14 ${operation.color} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                    <OperationIcon type={operation.type} />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center">
                    {operation.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      {/* Quick Actions */}
      <div className="p-4 pt-0">
        <Link href="/studies">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">View Saved Studies</p>
                  <p className="text-xs text-muted-foreground">Access your previous work</p>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-muted-foreground border-t border-border">
        <p>Light Process v1.0 | {profile?.employee_code}</p>
      </footer>
    </div>
  )
}

function OperationIcon({ type }: { type: string }) {
  const iconClass = "h-7 w-7 text-white"
  
  switch (type) {
    case 'hobbing':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
        </svg>
      )
    case 'shaping':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    case 'shaving':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      )
    case 'hard-turning':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    case 'od-grinding':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" strokeWidth={2} />
          <circle cx="12" cy="12" r="3" strokeWidth={2} />
        </svg>
      )
    case 'id-grinding':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <circle cx="12" cy="12" r="5" strokeWidth={2} strokeDasharray="4 2" />
        </svg>
      )
    case 'gear-grinding':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" strokeWidth={2} />
        </svg>
      )
    default:
      return <Cog className={iconClass} />
  }
}
