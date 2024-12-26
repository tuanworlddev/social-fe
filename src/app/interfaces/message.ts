export interface Message {
    id: string;
    senderId: number;
    receiverId: number;
    content: string;
    status: 'SENT' | 'EDITED' | 'RECALLED';
    sentAt: string;
    updatedAt: string;
}