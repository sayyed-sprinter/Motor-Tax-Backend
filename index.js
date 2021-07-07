const express = require('express');

const taxpayerRoutes = require('./routes/taxpayerRoutes');
let port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/api/taxpayer', taxpayerRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/motors', (req, res) => {
  res.status(200).send('motor route');
});

app.listen(port, () => {
  console.log('API STARTED and listening on port 3000');
});
