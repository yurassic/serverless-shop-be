import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient()

const query = async (params, callback) => {
  try {
    const data = await dynamoDB.query(params).promise()
    return data.Items[0] || null
  } catch (error) {
    console.error(error)
    callback(null, {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: `Couldn\'t fetch the ${params.TableName}.`,
    })
  }
}

// SEE: I'm lazy to get stocks here (in task description it wasn't mention)
export const handler = async (event, context, callback) => {
  console.log(event, 'Lambda request')

  const tableParams = {
    TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': event.pathParameters.productId,
    },
  }

  const product = await query(tableParams, callback)

  if (!product) {
    return {
      statusCode: 404,
      body: 'Product not found',
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify(product),
  }
}
