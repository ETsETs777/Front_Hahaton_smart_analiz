export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'streaming' | 'needs_fields_selection'
  createdAt: string
  error?: string
  sessionId?: string
  proposedFields?: FormFieldReference[]
  selectedFields?: FormFieldReference[]
  type?: 'WELCOME' | 'MESSAGE'
}

export interface ChatParticipant {
  id: string
  email: string
  role?: string
  displayName?: string
}

export interface FormFieldReference {
  field: string
  value: string
  label?: string
}

