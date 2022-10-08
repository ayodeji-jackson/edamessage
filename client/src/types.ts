export interface User {
  id: string, 
  name: string, 
  picture: string, 
  convosIds: string[]
}

export interface Message {
  message: string, 
  byMe: boolean
}