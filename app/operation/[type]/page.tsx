import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getOperationConfig } from '@/lib/operations-config'
import OperationForm from '@/components/operation-form'

interface OperationPageProps {
  params: Promise<{ type: string }>
}

export default async function OperationPage({ params }: OperationPageProps) {
  const { type } = await params
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  const config = getOperationConfig(type)
  
  if (!config) {
    notFound()
  }

  return <OperationForm config={config} userId={user.id} />
}
