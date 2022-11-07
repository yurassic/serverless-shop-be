import AWS from 'aws-sdk';
const sns = new AWS.SNS()

export const handler = async (event) => {
  console.log(event, 'Lambda request')
  const products = []

  try {
    event.Records.forEach(product => {
      products.push(product.body)
    })

    const params = {
      Subject: 'New products were created',
      Message: JSON.stringify(products),
      TopicArn: process.env.SNS_ARN,
    }

    await sns.publish(params).promise()

    console.log("Products:", products)

  } catch (error) {
    console.log(error)
  }

  return products
}
