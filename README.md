# serverless-shop-be
Repository for shop back-end of AWS mentoring course

## Mocks:
Generated with this service: https://json-generator.com/

Template:

`[
  '{{repeat(10)}}',
  {
    id: '{{objectId()}}',
    color: '{{random("red", "black", "white", "yellow", "blue", "brown", "green")}}',
    quantity: '{{integer([0], [50])}}',
    price: '{{floating(1000, 4000, 2)}}',
    picture: 'https://source.unsplash.com/random?snowboard',
    title: '{{lorem(1, "word")}}',
    name: '{{lorem(1, "word")}}',
    description: '{{lorem(1, "paragraphs")}}',
    size: '{{integer([140], [230])}}',
    brand: '{{random("burton", "volcom", "vans", "quicksilver")}}',
    gender: '{{gender()}}',
    year: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss Z")}}'
  }
]`


