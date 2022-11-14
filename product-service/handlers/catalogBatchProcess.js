import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const sns = new AWS.SNS()
const dynamoDB = new AWS.DynamoDB.DocumentClient()


const formatMessage = products => 
  products
    .map(({id, title, price, count}) => `New product created - id: ${id}, title: ${title}, price: ${price} count: ${count}`)
    .join('\n')


export const handler = async (event) => {
  console.log(event, 'Lambda request')
  const products = []

  try {
    event.Records.forEach(product => {
      products.push(JSON.parse(product.body))
    })

    const snsParams = {
      Subject: 'New products were created',
      Message: formatMessage(products),
      TopicArn: process.env.SNS_ARN,
    }

    // Add products to DB (It should in reusable function frome createProduct.js, but I'm lazy to do it)
    await products.forEach(async (product) => {
      const productTableParams = {
        TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
        Item: {
          id: uuidv4(),
          title: product.title,
          description: product.description,
          price: product.price,
        },
      }
      
      const stockTableParams = {
        TableName: process.env.DYNAMODB_STOCKS_TABLE,
        Item: {
          product_id: uuidv4(),
          count: product.count,
        },
      }

      await dynamoDB.put(productTableParams).promise()
      await dynamoDB.put(stockTableParams).promise()
    })

    // Send and email
    await sns.publish(snsParams).promise()

    console.log("Products:", products)

  } catch (error) {
    console.error(error)
  }

  return JSON.stringify(products)
}
