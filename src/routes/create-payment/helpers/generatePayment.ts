import { v4 as uuid } from 'uuid';

import { NFT, PaymentEntity } from '../../../entities/payment.entity';

export const generatePayment = (payload: CreatePaymentPayload): PaymentEntity => {
  const currentTime = new Date().getTime();

  return {
    id: uuid(),
    createdAt: currentTime,
    updatedAt: currentTime,
    userId: payload.userId,
    eventId: payload.eventId,
    nfts: generateNFTsFromPayload(payload.nfts),
    walletPublicKey: payload.walletPublicKey,

    provider: payload.provider,
    callbackStatus: 'Pending',
    paymentStatus: 'Pending',
  };
};

const generateNFTsFromPayload = (payload: CreateNFTPayload[]): NFT[] => {
  const generatedNFTs: NFT[] = [];

  payload.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      const newNFT: NFT = {
        mint: '',
        mintDate: 0,
        transaccionId: '',
        type: item.type,
        unitPrice: item.unitPrice,
      };

      generatedNFTs.push(newNFT);
    }
  });

  return generatedNFTs;
};

export type CreatePaymentPayload = Pick<PaymentEntity, 'userId' | 'eventId' | 'walletPublicKey' | 'provider'> & {
  nfts: CreateNFTPayload[];
};

type CreateNFTPayload = Pick<NFT, 'type' | 'unitPrice'> & { quantity: number };
