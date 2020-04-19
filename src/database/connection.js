const Sequelize = require("sequelize")

const connection = new Sequelize('passport_demo', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    timezone:'-03:00'
})

module.exports = connection

/*
 Arquivo com a configuração de banco de dados
 foi utilizado mysql no exemplo com a lib sequelize
*/
