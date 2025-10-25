import * as dynamoose from "dynamoose";

import { Item } from "dynamoose/dist/Item";
import { TokenTransferEntity } from "@domain/entities/TokenTransferEntity";

interface TokenTransferDocument extends TokenTransferEntity, Item {}

const TokenTransferSchema = new dynamoose.Schema({
  id: { type: String, required: true, index: { name: "idIndex" } },
  userId: { type: String, required: true, hashKey: true },
  walletAddress: { type: String, required: true, index: { name: "walletAddressIndex" } },
  eventId: { type: String, required: true },
  tokenAmount: { type: Number, required: true },
  transactionStatus: { type: String, required: true },
  transactionHash: { type: String, required: false },
  sqsMessageId: { type: String, required: false },
  createdAt: { type: Number, required: true, rangeKey: true },
  updatedAt: { type: Number, required: true },
});

const tableName = `TOKEN_TRANSFERS_${process.env.ENV}`;

export const TokenTransferModel = dynamoose.model<TokenTransferDocument>(
  tableName,
  TokenTransferSchema,
  {
    throughput: "ON_DEMAND",
  }
);
