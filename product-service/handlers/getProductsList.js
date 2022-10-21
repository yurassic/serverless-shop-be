import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient()

const scan = async (params, callback) => {
  try {
    const data = await dynamoDB.scan(params).promise()
    return data.Items;
  } catch (error) {
    console.error(error)
    callback(null, {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: `Couldn\'t fetch the ${params.TableName}.`,
    })
  }
}

const productTableParams = {
  TableName: process.env.DYNAMODB_PRODUCTS_TABLE
}

const stockTableParams = {
  TableName: process.env.DYNAMODB_STOCKS_TABLE
}

export const handler = async (event, context, callback) => {
  console.log(event, 'Lambda request')

  const products = await scan(productTableParams, callback)
  const stocks = await scan(stockTableParams, callback)

  const result = products.map(product => {
    const relatedStock = stocks.find(stock => product.id === stock.product_id)
    // SEE: I decide to return 0 if no data in stocks, for me it's looks more clear than don't have count in response. 
    return {...product, count: relatedStock ? relatedStock.count : 0}
  })

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}