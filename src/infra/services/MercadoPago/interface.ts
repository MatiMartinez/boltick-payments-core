export interface GenerateLinkDTO {
  email: string;
  external_reference: string;
  totalPrice: number;
}

interface Item {
  id: string;
  quantity: number;
  title: string;
  unit_price: number;
}

interface Payer {
  email: string;
}

interface BackUrls {
  failure: string;
  pending: string;
  success: string;
}

export interface GeneratePaymentLinkResponse {
  url: string;
}
