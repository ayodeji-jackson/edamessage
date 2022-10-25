export interface User {
  id: string;
  name: string;
  picture: string;
}

export interface Message {
  id?: string;
  text: string;
  senderId: string;
  recipientId?: string;
  convo?: Convo;
  timestamp: string;
  readByIds?: String[];
}

export interface Convo {
  id: string;
  name?: string;
  messages: Message[];
  parties: User[];
  partiesIds: string[];
  picture?: string;
  isGroup: boolean;
}
