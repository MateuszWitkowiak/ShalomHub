export interface Friend {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  
export interface Message {
    _id: string;
    sender: string;
    receiver: string;
    text: string;
    timestamp: string;
}