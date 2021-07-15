const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

const connectDb = require('./config/db');
const taxpayerRoutes = require('./routes/taxpayerRoute');
const uploadRoute = require('./routes/uploadRoute');
const insuranceAgentsRoutes = require('./routes/insuranceAgentsRoute');
const insuranceRoute = require('./routes/insuranceRoute');

dotenv.config();

connectDb();

let PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

const _dirname = path.resolve();
app.use('/uploads', express.static(path.join(_dirname, '/uploads')));

app.use('/api/taxpayer', taxpayerRoutes);
app.use('/api/uploads', uploadRoute);
app.use('/api/insurance-agents', insuranceAgentsRoutes);
app.use('/api/pay-insurance',insuranceRoute);



app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

module.exports = app;
