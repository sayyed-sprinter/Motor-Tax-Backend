const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');

const connectDb = require('./config/db');
const taxpayerRoutes = require('./routes/taxpayerRoute');

dotenv.config();

connectDb();

let PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/taxpayer', taxpayerRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
