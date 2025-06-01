const { Sequelize } = require('sequelize');


const connection = new Sequelize("parking","postgres","rivaldo12",{
    host: "localhost",
    dialect: "postgres",
})

module.exports = connection;