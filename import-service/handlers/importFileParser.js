import AWS from 'aws-sdk';
import csvParser from 'csv-parser';

const s3 = new AWS.S3()
const sqs = new AWS.SQS()

const BUCKET = 'import-service-yn'
const CATALOG_SQS_URL = 'https://sqs.eu-west-1.amazonaws.com/681538010575/catalogItemsQueue'

export const handler = async (event) => {
  console.log(event, 'Lambda request')

  const s3Key = event.Records[0].s3.object.key

  try {
    const s3ReadStream = await s3.getObject({ Bucket: BUCKET, Key: s3Key }).createReadStream()

    const result = []

    await new Promise((resolve, reject) => {
      s3ReadStream
          .pipe(csvParser())
          .on('data', (data) => {
            result.push(data)
          })
          .on('error', (error) => reject(error))
          .on('end', () => resolve())
    })



    // Send every result item with SQS
    for (const item of result) {
      const params = {
        QueueUrl: CATALOG_SQS_URL,
        MessageBody: JSON.stringify(item)
      }
  
      await sqs.sendMessage(params).promise()
      console.log('Send SQS message:', item)
    }
    
    return {
        statusCode: 200,
        body: result
    }
  } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: 'Internal error',
      }
  }
}
