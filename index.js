const express = require('express')
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const db = require('./src/db')

const app = express()

app.engine('html', mustacheExpress())
app.set('view engine', 'html')
app.set('views', __dirname + '/src/views')

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(session({
    secret: 'secret-token',
    name: 'sessionId',  
    resave: false,
    saveUninitialized: false
}))

app.use(express.static('./src/imagens'));
app.use(express.static('./src/views/styles'));

// Define as rotas da aplicação (declaradas na pasta /src/routes/)
app.use('/', require('./src/routes/indexRoute'));
app.use('/', require('./src/routes/pessoa_usuarioRoute'));
app.use("/", require("./src/routes/contaRoute"));

// app.use('/', require('./src/routes/api/pessoaAPIRoutes'));

// db.drop().then(() => {
//     db.sync(() => console.log(`Banco de dados conectado`));
// }).catch(err => {
//     console.error('Erro ao limpar o banco de dados:', err);
// });

db.sync(() => console.log(`Banco de dados conectado`));

const app_port = 8000
app.listen(app_port, function () {
    console.log('app rodando na porta ' + app_port)
})





// TESTE DE BANCO //
// (async () => {
//     const database = require('./src/db');
//     const Pessoa = require('./src/models/pessoa')
//     const Usuario = require('./src/models/usuario')
//     const Conta_corrente = require('./src/models/conta_corrente')
//     const Movimento = require('./src/models/movimento')
//     await database.sync()

//     const nova_pessoa = await Pessoa.create({
//         nome: 'Mateus',
//         cpf: '06825153100',
//         data_nascimento: '2002-02-05',
//         telefone: '834723782',
//         endereco: 'rua 8',
//         cep: '3704778'
//     })
//     console.log(nova_pessoa)

//     try{
//         const pessoas = await Pessoa.findAll()
//         console.log(pessoas);
//     } catch(error){
//         console.error('Error: ', error)
//     }
// })();