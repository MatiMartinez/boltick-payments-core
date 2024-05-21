export interface GeneratePaymentLinkPayload {
  auto_return?: 'approved' | 'all';
  back_urls: BackUrls;
  external_reference: string;
  items: Item[];
  payer: Payer;
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
