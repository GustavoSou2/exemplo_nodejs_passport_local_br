const express = require("express")
const app = express() // express iniciando
const bodyParser = require("body-parser") // for input forms
const connection = require('./src/database/connection') // my conncection

app.use(bodyParser.urlencoded({ extended: false })) //body parser
app.use(bodyParser.json()) // format body parser

app.set("view engine", 'ejs') // my engine view

app.use(express.static('public')) // my statics

const userController = require("./src/controllers/UserControler") // userController
const User = require('./src/models/user/User') // model user

connection.authenticate().then(() => { // conexão com o banco de dados
    console.log("Concectou na base de dados")
}).catch(error => {
    console.log(error)
})

app.use('/', userController)

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(8080, () => {
    console.log("http://localhost:8080/")
})