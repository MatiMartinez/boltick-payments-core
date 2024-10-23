import { DynamoDBClient, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';

import { createUpdateExpressions } from './utils/dynamodb';
import { PaymentEntity, Status } from '../entities/payment.entity';

export const getPaymentDB = async (id: string): Promise<PaymentEntity> => {
  const dynamoClient = getDynamoInstance();

  const response = await dynamoClient.send(
    new QueryCommand({
      TableName: `PAYMENTS_${process.env.ENV}`,
      IndexName: 'idIndex',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': { S: id } },
      ProjectionExpression: 'id, createdAt, userId, callbackStatus',
    })
  );

  if (!response.Items || response.Items.length === 0) {
    console.log('Error obtaining payment in database.', JSON.stringify(response, null, 2));
    throw new Error('Error obtaining payment in database.');
  }

  return unmarshall(response.Items[0]) as unknown as PaymentEntity;
};

export const savePaymentDB = async (payload: PaymentEntity): Promise<PaymentEntity> => {
  const { userId, createdAt, ...rest } = payload;

  const dynamoClient = getDynamoInstance();

  const { updateExpression, expressionAttributeValues, expressionAttributeNames } = createUpdateExpressions(rest);

  const response = await dynamoClient.send(
    new UpdateItemCommand({
      TableName: `PAYMENTS_${process.env.ENV}`,
      Key: marshall({ userId, createdAt }),
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    })
  );

  if (!response.Attributes) {
    console.log('Error saving payment in database.', JSON.stringify(response, null, 2));
    throw new Error('Error saving payment in database.');
  }

  return unmarshall(response.Attributes) as unknown as PaymentEntity;
};

export const updatePaymentCallbackStatusDB = async (userId: string, createdAt: number, callbackStatus: Status) => {
  const dynamoClient = getDynamoInstance();

  const { updateExpression, expressionAttributeValues, expressionAttributeNames } = createUpdateExpressions({
    callbackStatus,
  });

  const response = await dynamoClient.send(
    new UpdateItemCommand({
      TableName: `PAYMENTS_${process.env.ENV}`,
      Key: marshall({ userId, createdAt }),
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    })
  );

  if (!response.Attributes) {
    console.log('Error updating payment in database.', JSON.stringify(response, null, 2));
    throw new Error('Error updating payment in database.');
  }

  return unmarshall(response.Attributes) as unknown as PaymentEntity;
};

const getDynamoInstance = () => {
  return new DynamoDBClient({ region: 'us-east-1' });
};
