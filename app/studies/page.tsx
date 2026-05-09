import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StudiesClient from '@/components/studies-client'

export default async function StudiesPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  const { data: studies } = await supabase
    .from('studies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <StudiesClient studies={studies || []} />
}
