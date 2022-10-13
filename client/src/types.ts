export interface User {
  id: string, 
  name: string, 
  picture: string, 
  convosIds: string[]
}

export interface Message {
  text: string, 
  senderId: string, 
  convoOrRecipientId?: string, 
  timestamp: Date
}

export interface Convo {
  id: string, 
  name?: string, 
  messages: Message[],
  parties: User[], 
  picture?: string, 
  isGroup: boolean
}