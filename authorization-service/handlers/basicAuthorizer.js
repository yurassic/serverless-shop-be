export const handler = async (event, ctx, cb) => {
  console.log(event, 'Lambda request')

  if(event.type != 'TOKEN'){
    cb('Unauthorized')
  }

  try {
    const authorizationToken = event.authorizationToken
    const encodedCreds = authorizationToken.split(' ')[1]
    const buff = Buffer.from(encodedCreds, 'base64')
    const creds = buff.toString('utf-8').split(':')
    const userName = creds[0]
    const password = creds[1]

    console.log(`Username: ${userName}, Password: ${password} `)

    const storedPassword = process.env[userName]

    const effect = !storedPassword || storedPassword != password ? 'Deny' : 'Allow'

    const policy = generatePolicy(encodedCreds, event.methodArn, effect)

    cb(null, policy)

  } catch (error){
    console.error(error)
    cb(`Unauthorized: ${error.message}`)
  }
}

const generatePolicy = (principalId, resource, effect) => ({
    principalId: principalId,
    policyDocument: {
      Version: '2021-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  })
