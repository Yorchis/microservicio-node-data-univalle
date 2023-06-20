const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models/index');

// Settings
const PORT = process.env.PORT || 4005;

// Middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT', 'DELETE', 'OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rutas
app.use(require('./routes'));

// sequelize.sync({ force: true });

app.listen(4005, function () {
  console.log(`LOGIN MicroService listening on http://localhost:${PORT}`);

  sequelize.authenticate().then(() => {
      console.log('Nos hemos conectado a la base de datos!!!!!');
  })
});