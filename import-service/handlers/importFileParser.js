import AWS from 'aws-sdk';
import csvParser from 'csv-parser';

const s3 = new AWS.S3()

const BUCKET = 'import-service-yn'

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

    console.log(result, 'File parser result')
    
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
