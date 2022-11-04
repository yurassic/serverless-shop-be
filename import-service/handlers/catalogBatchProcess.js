
export const handler = async (event) => {
  console.log(event, 'Lambda request')

  const products = []

  event.Records.forEach(product => {
    products.push(product.body)
  });

  console.log(products, 'catalog')

  // TODO: Trigger product-service create lambda with SNS service

  return products
}
