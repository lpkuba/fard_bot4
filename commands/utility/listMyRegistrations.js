const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-my-registrations')
        .setDescription('Vypíše všechny akcí u kterých jste zaregistrovaný'),
    async execute(interaction,database) {
        await interaction.deferReply();
        database.query(`SELECT COUNT(userId) FROM uzivatele WHERE userId = ${interaction.user.id}`, function (err, results, fields) {
            console.log(results[0]['COUNT(userId)'] == 0);
            if (results[0]['COUNT(userId)']) {
                interaction.editReply({content: "Nemáte založený účet pro registrace! Prosíme využijte příkazu /create-user! ❌", flags: MessageFlags.Ephemeral});
                return;
            }
        })
        database.query(`SELECT akce.name, akce.date, registrace.paid FROM akce INNER JOIN registrace ON akce.akceId = registrace.akceId WHERE userId = "${interaction.user.id}" ORDER BY akce.date`, function (err, results, fields) {
            if(results.length == 0){
                interaction.editReply({content: "Nejste zaregistrován u žádné akce! ❌", flags: MessageFlags.Ephemeral});
            }
            else{
                let message = "Datum a čas / Název / Zaplaceno \n";
                console.log(results);
                results.forEach(row => {
                    row.date = new Date(row.date);
                    console.log(row.date);
                    console.log(typeof row.date);
                    let unix = Math.floor(row.date.getTime() / 1000);
                    let datum = `<t:${unix}:R>`;
                    let paid = (row.paid == 1) ? "✅" : "❌";
                    message += datum + "    " + row.name + "    " + paid + "\n";
                });
                console.log(message);
                interaction.editReply(`Pro uživatele <@${interaction.user.id}> vedeme následující registrace: \n ${message}`);
            }
        })

    },

};