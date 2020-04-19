const Sequelize = require("sequelize")
const connection = require("../../database/connection")

const user = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
    }, 
{
    timestamps: false
})

//user.sync({force:true}).then(()=>{}) // após a primeira execução comente essa linha
module.exports = user