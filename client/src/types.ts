export interface User {
  id: string;
  name: string;
  picture: string;
  convosIds: string[];
}

export interface Message {
  id?: string;
  text: string;
  senderId: string;
  recipientId?: string;
  convo?: Convo;
  timestamp: Date;
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
