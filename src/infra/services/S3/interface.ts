export interface FileResponse {
  fileKey: string;
  content: Content | null;
}

interface Content {
  createdAt: number;
  imageUrl: string;
  paymentId: string;
  type: string;
  unitPrice: number;
  used: number;
}
