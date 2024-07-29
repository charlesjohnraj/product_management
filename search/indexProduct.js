const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: 'https://localhost:9200',
  ssl: {
    rejectUnauthorized: false,
  },
});

const products = [
  {
    id: 1,
    name: 'Bolero',
    description: '7 Seater',
    price: 10.99,
    category: 'SUV'
  },
  {
    id: 2,
    name: 'Innova',
    description: '8 Seater',
    price: 29.99,
    category: 'MPV'
  },
  {
    id: 3,
    name: 'Mustang',
    description: '4 Seater',
    price: 50.99,
    category: 'Coupe'
  },
  {
    id: 4,
    name: 'Cruze',
    description: '5 Seater',
    price: 20.99,
    category: 'Seden'
  },
  {
    id: 5,
    name: 'Polo',
    description: '5 Seater',
    price: 25.99,
    category: 'Hatch Back'
  }
];

async function indexProducts() {
  const body = products.flatMap(product => [
    { index: { _index: 'products', _id: product.id } },
    product
  ]);

  try {
    const { body: bulkResponse } = await client.bulk({ refresh: true, body });
    if (bulkResponse.errors) {
      console.error('Errors occurred during bulk indexing:', bulkResponse.items);
    } else {
      console.log('Products indexed successfully');
    }
  } catch (error) {
    console.error('Error indexing products:', error);
  }
}

indexProducts();