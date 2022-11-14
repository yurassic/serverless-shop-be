import AWS from 'aws-sdk';

const s3 = new AWS.S3()

export const handler = async (event) => {
  console.log(event, 'Lambda request')
}
