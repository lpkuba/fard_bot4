const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mark-as-paid')
        .setDescription('"Zaplacení" registrace')
        .addNumberOption(option => 
            option.setName("regid")
                .setDescription("ID registrace")
                .setRequired(true)
        ),
    async execute(interaction,database) {
        let regId = interaction.options.getNumber("regid");
        database.query(`UPDATE registrace SET paid = 1 WHERE idRegistrace = (?)`, [regId], function (err, results, fields) {
            if(err) throw err;
            interaction.reply('Úspěšně zaplaceno!✅');
        })
             
        


    },
};