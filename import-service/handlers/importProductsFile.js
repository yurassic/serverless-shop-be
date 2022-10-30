import AWS from 'aws-sdk';

const s3 = new AWS.S3()

const BUCKET = 'import-service-yn'

export const handler = async (event) => {
  console.log(event, 'Lambda request')
  const fileName = event.queryStringParameters?.name

  if (!fileName) {
    return {
      statusCode: 400,
      body: 'Name not provided',
    }
  }

  const params = {
    'Bucket': BUCKET,
    'Key': `uploaded/${fileName}`,
  }


  try {
    const url = await s3.getSignedUrl('putObject', params)
    return {
        statusCode: 200,
        body: url,
    }
  } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: 'Internal error',
      }
  }
}
