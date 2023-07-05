const Sequelize = require('sequelize');
const database = require('../db');
const Movimento = require("./movimento");

const Conta_corrente = database.define('conta_corrente', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    numero: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_abertura: {
        type: Sequelize.DATE,
        allowNull: false
    },
    saldo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
})
Conta_corrente.hasMany(Movimento);
Movimento.belongsTo(Conta_corrente);

module.exports = Conta_corrente;