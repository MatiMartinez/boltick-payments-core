import { PaymentEntity } from 'src/domain/payment.entity';
import { PaymentRepository } from '../../domain/payment.repository';
import { createUpdateExpressions } from '../utils/dynamodb';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

export class PaymentDynamoRepository implements PaymentRepository {
  constructor(private readonly dynamoClient: DynamoDBClient) {}

  createPayment = async (payload: PaymentEntity) => {
    const { id, ...rest } = payload;

    const { updateExpression, expressionAttributeValues, expressionAttributeNames } = createUpdateExpressions(rest);

    const response = await this.dynamoClient.send(
      new UpdateItemCommand({
        TableName: 'PAYMENTS',
        Key: { id: { S: id } },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
      })
    );

    return response.Attributes as unknown as PaymentEntity;
  };
}
