import * as dynamoose from "dynamoose";
import { Item } from "dynamoose/dist/Item";
import { UserEntity } from "@domain/entities/UserEntity";

interface UserDocument extends UserEntity, Item {}

const UserSchema = new dynamoose.Schema({
  email: { type: String, required: true, hashKey: true },
  walletAddress: { type: String, required: true, rangeKey: true },
  walletAlias: { type: String, required: true, index: { name: "walletAliasIndex" } },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
});

const tableName = `USERS_${process.env.ENV}`;

export const UserModel = dynamoose.model<UserDocument>(tableName, UserSchema, { throughput: "ON_DEMAND" });
