import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new AWS.DynamoDB.DocumentClient()

const put = async (params, callback) => {
  try {
    await dynamoDB.put(params).promise()
  } catch (error) {
    console.error(error)
    callback(null, {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: `Couldn\'t create the product.`,
    })
  }
}

const validationErrorResponse = (message, callback) => {
  console.error(message);
  callback(null, {
    statusCode: 400,
    headers: { 'Content-Type': 'text/plain' },
    body: message,
  });
} 

const validateData = (data, callback) => {
  if (typeof data.description !== 'string') {
    validationErrorResponse('Description should be string', callback)
    return
  }
  if (typeof data.title !== 'string') {
    validationErrorResponse('Description should be string', callback)
    return
  }
  if (data.title.length > 30) {
    validationErrorResponse('Title can\'t be longer than 30 symbols', callback)
    return
  }
  // SEE: I'm lazy to add more...
}


export const handler = async (event, context, callback) => {
  console.log(event, 'Lambda request')

  const data = JSON.parse(event.body)

  validateData(data, callback)

  const productTableParams = {
    TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
    Item: {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      price: data.price,
    },
  }
  
  const stockTableParams = {
    TableName: process.env.DYNAMODB_STOCKS_TABLE,
    Item: {
      product_id: uuidv4(),
      count: data.count,
    },
  }

  let result = {...productTableParams.Item}

  await put(productTableParams, callback)

  if (data.count) {
    await put(stockTableParams, callback)
    result = {...result, ...stockTableParams.Item}
  }


  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}