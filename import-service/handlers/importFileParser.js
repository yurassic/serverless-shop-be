import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
import { v4 as uuidv4 } from 'uuid';
import chunk from 'lodash/chunk'


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

    // Our SQS support up to 5 messages in one batch
    const spilttedResult = chunk(result, 5);

    // It looks like this logic is redundant and batch requests will work by default when we set it in serverless file.
    for (const arr of spilttedResult) {
      var params = {
        QueueUrl: CATALOG_SQS_URL,
        Entries: []
      };
      for (const message of arr) {
        params.Entries.push({
          Id: uuidv4(),
          MessageBody: JSON.stringify(message)
        });
      }
      await sqs.sendMessageBatch(params).promise()
      console.log('Send batch message:', params.Entries)
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
