const { Sequelize } = require('sequelize');


const connection = new Sequelize("db_name","username","password",{
    host: "localhost",
    dialect: "postgres",
})

module.exports = connection;
