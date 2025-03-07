export interface FileResponse {
  fileKey: string;
  content: Content;
}

interface Content {
  createdAt: number;
  imageUrl: string;
  paymentId: string;
  type: string;
  unitPrice: number;
  used: number;
}
