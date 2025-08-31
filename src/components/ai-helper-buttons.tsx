'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sparkles, Wand2, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { generateDescription, draftReminder, validateAIInput, LineItemData } from '@/lib/ai-helper'

interface AIHelperButtonsProps {
  onLineItemGenerated?: (lineItem: LineItemData) => void
  onReminderGenerated?: (reminder: string) => void
  className?: string
}

export function AIHelperButtons({ onLineItemGenerated, onReminderGenerated, className }: AIHelperButtonsProps) {
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)
  const [descriptionInput, setDescriptionInput] = useState('')
  const [reminderInput, setReminderInput] = useState('')
  const [reminderContext, setReminderContext] = useState('Payment is overdue')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateDescription = async () => {
    const validation = validateAIInput(descriptionInput)
    if (!validation.isValid) {
      toast.error(validation.error)
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateDescription(descriptionInput)
      if (result.success && result.data) {
        onLineItemGenerated?.(result.data)
        toast.success('Line item generated successfully!')
        setIsDescriptionDialogOpen(false)
        setDescriptionInput('')
      } else {
        toast.error(result.error || 'Failed to generate line item')
      }
    } catch (error) {
      toast.error('Failed to generate line item')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDraftReminder = async () => {
    const validation = validateAIInput(reminderInput)
    if (!validation.isValid) {
      toast.error(validation.error)
      return
    }

    setIsGenerating(true)
    try {
      const result = await draftReminder(reminderInput, reminderContext)
      if (result.success && result.text) {
        onReminderGenerated?.(result.text)
        toast.success('Reminder drafted successfully!')
        setIsReminderDialogOpen(false)
        setReminderInput('')
        setReminderContext('Payment is overdue')
      } else {
        toast.error(result.error || 'Failed to draft reminder')
      }
    } catch (error) {
      toast.error('Failed to draft reminder')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* AI Description Generator */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>AI Suggest Description</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Wand2 className="h-5 w-5" />
              <span>AI Description Generator</span>
            </DialogTitle>
            <DialogDescription>
              Enter a brief description and let AI generate a complete invoice line item with description, quantity, and price
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description-input">Brief Description</Label>
              <Input
                id="description-input"
                placeholder="e.g., 3 logo concepts, $300"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {descriptionInput.length}/200 characters
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDescriptionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateDescription}
                disabled={isGenerating || !descriptionInput.trim()}
                className="flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Reminder Drafter */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>AI Draft Reminder</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>AI Reminder Drafter</span>
            </DialogTitle>
            <DialogDescription>
              Let AI help you draft a professional payment reminder email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reminder-input">Brief Context</Label>
              <Input
                id="reminder-input"
                placeholder="e.g., Invoice #123 overdue by 15 days"
                value={reminderInput}
                onChange={(e) => setReminderInput(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {reminderInput.length}/200 characters
              </p>
            </div>
            <div>
              <Label htmlFor="reminder-context">Reminder Type</Label>
              <select
                id="reminder-context"
                value={reminderContext}
                onChange={(e) => setReminderContext(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Payment is overdue">Payment is overdue</option>
                <option value="Payment reminder">Payment reminder</option>
                <option value="Final notice">Final notice</option>
                <option value="Payment due soon">Payment due soon</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsReminderDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDraftReminder}
                disabled={isGenerating || !reminderInput.trim()}
                className="flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Drafting...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Draft Reminder</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
