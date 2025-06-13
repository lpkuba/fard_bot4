const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-event')
        .setDescription('Vytvoření nové události.')
        .addStringOption(option => 
            option.setName("name")
                .setDescription("Název akce")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("desc")
                .setDescription("Popisek k akci")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("loc")
                .setDescription("Místo konání akce")
                .setRequired(true)
        )
        .addNumberOption(option => 
            option.setName("price")
                .setDescription("Cena akce (v Kč)")
                .setMinValue(0)
                .setRequired(true)
        ),
    async execute(interaction,database) {
        let name = interaction.options.getString("name");
        let desc = interaction.options.getString("desc");
        let loc = interaction.options.getString("loc");
        let price = interaction.options.getNumber("price");
        let insertId;
        await database.query(`INSERT INTO akce (name, description, loc, price) VALUES (?,?,?,?)`, [name, desc, loc, price], function (err, results, fields) {
            if(err) throw err;
            interaction.reply({content: `Úspěšně vytvořena akce s ID: ${results.insertId}! ✅`, flags: MessageFlags.Ephemeral });
        })
             
        


    },
};