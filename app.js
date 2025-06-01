const express = require('express')
const routes = require('./router.js')
const bodyParser = require('body-parser');
const connection = require('./model/connection.js')
require('./model/user.js')
require('./model/parking.js')

const app = express()
app.use(bodyParser.json())
app.use(routes)

const port = 3000
connection.sync()
  .then(() => {
    console.log('Database connected & synced ');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database :', err);
  });
