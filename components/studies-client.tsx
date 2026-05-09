'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Trash2, FileText, Calendar, Loader2, Plus } from 'lucide-react'
import type { Study } from '@/lib/types'
import { getOperationConfig } from '@/lib/operations-config'

interface StudiesClientProps {
  studies: Study[]
}

export default function StudiesClient({ studies: initialStudies }: StudiesClientProps) {
  const [studies, setStudies] = useState(initialStudies)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const supabase = createClient()

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('studies')
        .delete()
        .eq('id', deleteId)

      if (error) throw error

      setStudies(prev => prev.filter(s => s.id !== deleteId))
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getOperationLabel = (type: string) => {
    const config = getOperationConfig(type)
    return config?.label || type
  }

  const getOperationColor = (type: string) => {
    const config = getOperationConfig(type)
    return config?.color || 'bg-gray-500'
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
            <h1 className="text-lg font-semibold text-foreground">Saved Studies</h1>
            <p className="text-xs text-muted-foreground">{studies.length} studies</p>
          </div>
        </div>
        <Link href="/home">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </Link>
      </header>

      {/* Studies List */}
      <main className="flex-1 p-4">
        {studies.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Studies Yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Start by selecting an operation from the home screen
              </p>
              <Link href="/home">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Study
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {studies.map((study) => (
              <Card 
                key={study.id} 
                className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setExpandedId(expandedId === study.id ? null : study.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${getOperationColor(study.operation_type)} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-sm font-bold">
                          {getOperationLabel(study.operation_type).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {getOperationLabel(study.operation_type)}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(study.created_at)}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(study.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                {expandedId === study.id && (
                  <CardContent className="p-4 pt-2 border-t border-border mt-2">
                    {study.job_details && Object.keys(study.job_details).length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Job Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(study.job_details).map(([key, value]) => (
                            value && (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>{' '}
                                <span className="text-foreground">{String(value)}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {study.machine_details && Object.keys(study.machine_details).length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Machine Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(study.machine_details).map(([key, value]) => (
                            value && (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>{' '}
                                <span className="text-foreground">{String(value)}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {study.cutting_parameters && Object.keys(study.cutting_parameters).length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Cutting Parameters</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(study.cutting_parameters).map(([key, value]) => (
                            value && (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>{' '}
                                <span className="text-foreground">{String(value)}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {study.tool_details && Object.keys(study.tool_details).length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Tool Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(study.tool_details).map(([key, value]) => (
                            value && (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>{' '}
                                <span className="text-foreground">{String(value)}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Study?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The study will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
