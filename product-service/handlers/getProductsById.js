import products from '../__mocks__/products.json'

export const handler = async (event) => {
  const { productId } = event.pathParameters
  const product = products.find(item => item.id === productId)
  return {
    statusCode: 200,
    body: JSON.stringify(product),
  }
}
