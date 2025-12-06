import { makeVar } from '@apollo/client'
import type { ChatMessage } from '../types'

export interface AiChatSession {
  messages: ChatMessage[]
  draft: string
}

export const aiChatSessionVar = makeVar<AiChatSession>({
  messages: [],
  draft: '',
})

export function updateDraft(draft: string) {
  const current = aiChatSessionVar()
  aiChatSessionVar({ ...current, draft })
}

export function updateMessages(messages: ChatMessage[]) {
  const current = aiChatSessionVar()
  aiChatSessionVar({ ...current, messages })
}

export function resetSession() {
  aiChatSessionVar({
    messages: [],
    draft: '',
  })
}

