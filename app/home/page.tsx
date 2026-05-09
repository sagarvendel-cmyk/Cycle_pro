import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HomeClient from '@/components/home-client'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return <HomeClient profile={profile} />
}
