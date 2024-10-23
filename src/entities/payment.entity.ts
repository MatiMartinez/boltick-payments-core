export interface PaymentEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  eventId: string;
  nfts: NFT[];
  walletPublicKey: string;

  provider: Provider;
  callbackStatus: Status;
  paymentStatus: Status;
  payment?: Payment;
}

export interface NFT {
  mint: string;
  mintDate: number;
  transaccionId: string;
  type: string;
  unitPrice: number;
}

interface Payment {
  amount: number;
  code: string;
  id: string;
  updatedAt: number;
}

export type Status = 'Pending' | 'Approved' | 'Rejected';
export type Provider = 'Mercado Pago';
