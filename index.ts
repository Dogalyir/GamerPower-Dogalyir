import type { FilterGames } from "./src/api-gamer";
import { db } from "./src/db";
import { GamerTable } from "./src/db/db-schemas";
import { startNequiMonitoring } from "./src/nequi-monitor";
import "./src/db/migrate";

const urlGamer = new URL("https://www.gamerpower.com/api/filter");
urlGamer.searchParams.set("platform", "epic-games-store.steam");
urlGamer.searchParams.set("type", "game");
urlGamer.searchParams.set("sort", "popularity");

async function main() {
  const reqGamer = await fetch(urlGamer);
  const jsonGamer = (await reqGamer.json()) as FilterGames[];

  for (const game of jsonGamer) {
    const findGame = await db.query.GamerTable.findFirst({
      where: (t, o) => o.eq(t.id, game.id),
    });

    if (findGame) {
      // EXISTE EL JUEGO
      console.log("Existe el juego putos", game.title);
      continue;
    }
    // NO EXISTE EL JUEGO
    await db.insert(GamerTable).values({ id: game.id });

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          chat_id: "@GamerPowerDogalyir",
          photo: game.image,
          caption:
            `<b>${game.title}</b>\n\n${game.description}\n<i>🎮 Plataforma:</i> ${game.platforms}`.trim(),
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🎁 Reclamar",
                  url: game.open_giveaway,
                },
              ],
            ],
          },
        }),
      }
    );
  }
}

await main();

setInterval(() => main().then(), 3600000);

// Start Nequi monitoring if NEQUI environment variable is set
if (process.env.NEQUI) {
  console.log("🔍 Variable NEQUI detectada, iniciando monitoreo de Nequi...");
  await startNequiMonitoring(process.env.NEQUI);
} else {
  console.log("ℹ️  Variable NEQUI no detectada, monitoreo de Nequi desactivado");
}

