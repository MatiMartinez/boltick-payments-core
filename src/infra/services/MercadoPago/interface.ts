export interface IMercadoPagoService {
  generateLink(input: GenerateLinkInput): Promise<GenerateLinkOutput>;
}

export interface GenerateLinkInput {
  email: string;
  externalReference: string;
  items: Array<{
    id: string;
    quantity: number;
    title: string;
    unit_price: number;
  }>;
  back_urls: {
    failure: string;
    pending: string;
    success: string;
  };
}

export interface GenerateLinkOutput {
  url: string;
}

export interface GeneratePreferenceInput extends GenerateLinkInput {}

export interface GeneratePreferenceOutput {
  back_urls: {
    failure: string;
    pending: string;
    success: string;
  };
  auto_return: string;
  external_reference: string;
  items: Array<{
    id: string;
    quantity: number;
    title: string;
    unit_price: number;
  }>;
  payer: { email: string };
}
