const express = require("express")
const router = express.Router()
const User = require("../models/user/user")
const isAuthenticated = require('../middleware/isAuthenticated')
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email', // nesse ponto renomeamos os parâmetros para serem aceitos pelo passport
    passwordField: 'password' // nesse ponto renomeamos os parâmetros para serem aceitos pelo passport
},
    function (username, password, done) {
        User.findOne({ where: { email: username } }).then(function(user){ // por padrão o passport não trabaha com promisse
            if (!user) {                                                  // por esse motivo está diferente da documentação
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user); // se tudo der certo retornamos o usuário
        });
    }
));

passport.serializeUser(function (user, cb) { // serialização do usuário
    cb(null, user);
});
passport.deserializeUser(function (obj, cb) { // desserialização do usuário
    cb(null, obj);
});
// o passport-local necessita do express-session
router.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

router.use(passport.initialize()); // inicializamos nesse ponto o passport
router.use(passport.session()); // inicializamos nesse ponto a sessão

router.get('/users', isAuthenticated, // nesse ponto aplicamos o middleware, só vai passar se tiver autenticado
    (req, res) => {
        User.findAll({ // buscamos todos os usuários nessa promisse
            raw: true, order: [ // ordenamos
                ['id', 'DESC']
            ]
        }).then(users => {
            res.render("admin/user/index.ejs", { users: users })
        }).catch(() => {
            console.log("algo de errado está acontecendo ao buscar usuários")
        })
    })

router.get('/create-user', isAuthenticated, (req, res) => { // rota para criar os usuários
    res.render("admin/user/createUser.ejs", { emailExistente: false })
})

router.post('/save-user', isAuthenticated,(req, res) => { // rota para salvar um usuário
    const email = req.body.email
    const password = req.body.password
    const emailExistente = 'O e-mail já existe'

    //const salt = bcrypt.genSaltSync(10) // nesse ponto poderíamos criar um hash sobre a senha
    //const hash = bcrypt.hashSync(password, salt) // nesse ponto poderíamos criar um hash sobre a senha
    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {
            User.create({
                email: email,
                password: password
            }).then(
                User.findAll({
                    raw: true, order: [
                        ['id', 'DESC']
                    ]
                }).then(users => {
                    res.redirect('/users')
                }).catch(error => {
                    console.log(error)
                }).catch(error => {
                    console.log(error)
                })
            )
        } else {
            res.render("admin/user/createUser.ejs", { emailExistente: emailExistente })
        }
    })
})

router.get('/login', (req, res) => {
    res.render('admin/user/login')
})

router.post('/login',
    passport.authenticate('local', { // verificando se está autenticado
        successRedirect: '/users', // ok
        failureRedirect: '/login', // falha
        failureFlash: true
    })
);

module.exports = router