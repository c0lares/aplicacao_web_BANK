const Sequelize = require('sequelize');
const database = require('../db');
const ContaCorrente = require('./conta_corrente');

const Usuario = database.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
Usuario.hasMany(ContaCorrente);
ContaCorrente.belongsTo(Usuario);

module.exports = Usuario;