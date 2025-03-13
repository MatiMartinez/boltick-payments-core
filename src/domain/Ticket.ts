export interface Ticket {
  payment: {
    eventId: string;
  };
  nft: {
    id: string;
    collectionName: string;
    collectionSymbol: string;
    ticketNumber: string;
    type: string;
    unitPrice: number;
  };
  createdAt: number;
  imageUrl: string;
  used: number;
  useDate: number;
  uri: string;
}
