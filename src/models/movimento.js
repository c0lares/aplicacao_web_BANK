const Sequelize = require('sequelize');
const database = require('../db');
const Conta_corrente = require('./conta_corrente');

const Movimento = database.define('movimento', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    data_movimento: {
        type: Sequelize.DATE,
        allowNull: false
    },
    valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    conta_corrente_origem: {
        type: Sequelize.INTEGER
    },
    conta_corrente_destino: {
        type: Sequelize.INTEGER
    },
    observacao : {
        type: Sequelize.STRING
    }
})

module.exports = Movimento;