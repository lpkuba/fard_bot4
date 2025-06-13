const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-register')
        .setDescription('Přiřazení Discord účtu k existujícímu uživateli z databáze.'),
    async execute(interaction,database) {
        await database.query(`SELECT `)
    },
};