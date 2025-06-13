const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-user')
        .setDescription('Registrace nového uživatele.')
        .addStringOption(option => 
            option.setName("name")
                .setDescription("Jméno a příjmení")
                .setMinLength(3)
                .setRequired(true)
        ),
    async execute(interaction,database) {
        let name = interaction.options.getString("name");
        await database.query(`INSERT INTO uzivatele (name, userId) VALUES (?,?) ON DUPLICATE KEY UPDATE name = VALUES(name)`, [name, interaction.user.id], function (err, results, fields) {
            if(err) throw err;
            let affectedRows = results.affectedRows;
            if(affectedRows === 1){
                interaction.reply({content: `Úspěšně registrován uživatel **${name}** k účtu <@${interaction.user.id}>! ✅`, flags: MessageFlags.Ephemeral });
            }
            else if(affectedRows === 2){
                interaction.reply({content: `Upraveno jméno uživatele na **${name}** k účtu <@${interaction.user.id}>! ✅`, flags: MessageFlags.Ephemeral });
            }
            else{
                interaction.reply({content: `Něco se nezdařilo. ❌`, flags: MessageFlags.Ephemeral });
            }
        })
             
        


    },
};