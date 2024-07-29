const elasticsearch = require('../config/elasticsearch');

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const { body } = await elasticsearch.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['name', 'description']
          }
        }
      }
    });
    res.status(200).json(body.hits.hits);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while searching for products');
  }
};

module.exports = { searchProducts };
