export interface FileResponse {
  fileKey: string;
  content: Content;
}

interface Content {
  payment: {
    id: string;
    userId: string;
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
}
