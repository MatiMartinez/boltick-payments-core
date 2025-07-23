export interface Ticket {
  ticketNumber: string;
  type: string;
  unitPrice: number;
  imageUrl: string;

  eventId: string;
  eventName: string;
  prName: string;

  assetId: string;
  collectionName: string;
  collectionSymbol: string;

  createdAt: number;
  used: number;
  useDate: number;
}
