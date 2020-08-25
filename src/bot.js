require("dotenv").config();

const { Client } = require("discord.js");
const client = new Client();
const PREFIX = "!";

const fetch = require("node-fetch");

async function findSummoner(summoner) {
  let result = await fetch(
    `https://${process.env.HOST}/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${process.env.DEV_API}`
  );
  let json = await result.json();

  return json;
}

async function getLeague(id) {
  let result = await fetch(
    `https://${process.env.HOST}/lol/league/v4/entries/by-summoner/${id}?api_key=${process.env.DEV_API}`
  );
  let json = await result.json();

  return json;
}

client.login(process.env.DC_TOKEN);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "elo") {
      findSummoner(args.join("")).then((res) => {
        const { id, name, summonerLevel } = res;

        getLeague(id).then((res) => {
          const soloQ = res[0];
          const flex = res;
          console.log(flex);
          // message.channel.send(
          //   `Na soloQ ${name} esta no elo ${soloQ.tier} ${soloQ.rank} com ${soloQ.leaguePoints}pts
          //    Na Fles ${name}  esta no elo ${flex.tier} ${flex.rank} com ${flex.leaguePoints}pts
          //   `
          // );
        });
      });
    }
  }
});
