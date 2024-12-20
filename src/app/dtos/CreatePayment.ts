import { NFT, Payment } from '@domain/Payment';

export type CreatePaymentDTO = Pick<Payment, 'userId' | 'eventId' | 'walletPublicKey' | 'provider'> & {
  nfts: NFTDTO[];
};

export type NFTDTO = Pick<NFT, 'collectionName' | 'collectionSymbol' | 'type' | 'unitPrice'> & { quantity: number };
