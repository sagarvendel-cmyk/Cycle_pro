'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ArrowLeft, Save, Loader2, Check, Settings, Briefcase, Gauge, Wrench } from 'lucide-react'
import type { OperationConfig, MachineDetails, JobDetails, CuttingParameters, ToolDetails } from '@/lib/types'
import { FIELD_LABELS } from '@/lib/operations-config'

interface OperationFormProps {
  config: OperationConfig
  userId: string
}

export default function OperationForm({ config, userId }: OperationFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [machineDetails, setMachineDetails] = useState<MachineDetails>({})
  const [jobDetails, setJobDetails] = useState<JobDetails>({})
  const [cuttingParameters, setCuttingParameters] = useState<CuttingParameters>({})
  const [toolDetails, setToolDetails] = useState<ToolDetails>({})

  const supabase = createClient()

  const handleMachineChange = (field: keyof MachineDetails, value: string) => {
    setMachineDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleJobChange = (field: keyof JobDetails, value: string) => {
    setJobDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleCuttingChange = (field: keyof CuttingParameters, value: string) => {
    setCuttingParameters(prev => ({ ...prev, [field]: value }))
  }

  const handleToolChange = (field: keyof ToolDetails, value: string) => {
    setToolDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('studies')
        .insert({
          user_id: userId,
          operation_type: config.type,
          machine_details: machineDetails,
          job_details: jobDetails,
          cutting_parameters: cuttingParameters,
          tool_details: toolDetails,
        })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push('/studies')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save study')
    } finally {
      setIsSaving(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Study Saved!</h2>
        <p className="text-muted-foreground text-center">Redirecting to your studies...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{config.label}</h1>
            <p className="text-xs text-muted-foreground">Fill in operation details</p>
          </div>
        </div>
        <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center`}>
          <span className="text-lg">{config.icon}</span>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 p-4 pb-24">
        <Accordion type="multiple" defaultValue={['machine', 'job', 'cutting', 'tool']} className="space-y-3">
          {/* Machine Details */}
          {config.machineFields.length > 0 && (
            <AccordionItem value="machine" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-card hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Machine Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 bg-card">
                <div className="grid gap-4">
                  {config.machineFields.map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{FIELD_LABELS[field] || field}</Label>
                      <Input
                        id={field}
                        type="text"
                        placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}`}
                        value={machineDetails[field] || ''}
                        onChange={(e) => handleMachineChange(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Job Details */}
          {config.jobFields.length > 0 && (
            <AccordionItem value="job" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-card hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-medium">Job Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 bg-card">
                <div className="grid gap-4">
                  {config.jobFields.map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{FIELD_LABELS[field] || field}</Label>
                      <Input
                        id={field}
                        type="text"
                        placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}`}
                        value={jobDetails[field] || ''}
                        onChange={(e) => handleJobChange(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Cutting Parameters */}
          {config.cuttingFields.length > 0 && (
            <AccordionItem value="cutting" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-card hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <Gauge className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="font-medium">Cutting Parameters</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 bg-card">
                <div className="grid gap-4">
                  {config.cuttingFields.map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{FIELD_LABELS[field] || field}</Label>
                      <Input
                        id={field}
                        type="text"
                        placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}`}
                        value={cuttingParameters[field] || ''}
                        onChange={(e) => handleCuttingChange(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Tool Details */}
          {config.toolFields.length > 0 && (
            <AccordionItem value="tool" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-card hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-chart-4" />
                  </div>
                  <span className="font-medium">Tool Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 bg-card">
                <div className="grid gap-4">
                  {config.toolFields.map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{FIELD_LABELS[field] || field}</Label>
                      <Input
                        id={field}
                        type="text"
                        placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}`}
                        value={toolDetails[field] || ''}
                        onChange={(e) => handleToolChange(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {error && (
          <Card className="mt-4 border-destructive">
            <CardContent className="p-4">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <div className="mx-auto max-w-[430px]">
          <Button 
            onClick={handleSave} 
            className="w-full" 
            size="lg"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Study...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Study
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
