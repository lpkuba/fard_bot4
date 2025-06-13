const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-registration')
        .setDescription('Manuální vytvoření registrace pro uživatele.')
        .addUserOption(option => 
            option.setName("name")
                .setDescription("Požadovaný uživatel")
                .setRequired(true)
        )
        .addNumberOption(option => 
            option.setName("idakce")
                .setDescription("ID akce")
                .setRequired(true)
        ),
    async execute(interaction,database) {
        let user = interaction.options.getUser("name");
        let akceId = interaction.options.getNumber("idakce");
        await database.query(`INSERT INTO registrace (akceId, userId) VALUES (?,?)`, [akceId, user.id], function (err, results, fields) {
            if(err){
                if(err.code === "ER_NO_REFERENCED_ROW_2"){
                    console.log(akceId);
                    console.log(user);
                    interaction.reply(`Neexistující uživatel nebo akce! ❌`);
                }
                else if(err){
                    throw err;
                }

            }
            else{
            database.query(`SELECT name FROM akce WHERE akceId = ${akceId}`, [], function (err, results, fields) {
                if(err) throw err;
                interaction.reply(`Úspěšně vytvořena registrace na akci **${results[0].name}** pro uživatele <@${user.id}>! ✅`);
            })  
        };
    })
        
 
        
             
        


    },

};