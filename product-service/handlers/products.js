import products from '../__mocks__/products.json'

export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(products)
  }
}