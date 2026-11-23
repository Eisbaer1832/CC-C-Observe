import { serve, sql } from "bun";
import { Database } from "bun:sqlite";
import dashboard from "./public/html/dashboard.html"

const db = new Database("database.db");

const server = serve({
  routes: {
    "/" : dashboard,

    // stock api 
    "/api/stock": {
      async GET(req) {
        const stock = await db.query(`SELECT * FROM storage WHERE time = (SELECT MAX(time) FROM storage AS s2 WHERE s2.item = storage.item) ORDER BY count DESC`).all();
        return Response.json(stock);
      },

      async POST(req) {
        const data = (await req.text()).split(", ");
        const time = Date.now()
        for (let i = 0; i < data.length; i++) {
            let item = data[i].split(" x")
          console.log(item)
          db.query(`
            INSERT INTO storage (item, count, time)
              VALUES (?, ?, ?)
              ON CONFLICT(item, time) DO UPDATE SET
                count = storage.count + excluded.count
          `).run(item[0], Number(item[1]), time);
        }
        return Response.json("success");
      },
    },

    "/api/stock/history": async req => {
      const stock_history = await db.query(`SELECT * FROM storage`).all();
      return Response.json(stock_history);
    },


    // stress api
    "/api/stress" : {
        async GET(req) {
            const stress = await db.query(`SELECT *, MAX(time) FROM stress`).get();
            return Response.json(stress);
        },
    },
    "/api/stress/current/:current/max/:max" : {
        async PUT(req) {
            const time = Date.now()
            db.query(`INSERT OR IGNORE INTO stress (current, max, time) VALUES (${req.params.current}, ${req.params.max}, ${time})`).run()
            return Response.json("sucess")
        }
    },
    "/api/stress/history": async req => {
      const stress_history = await db.query(`SELECT * FROM stress`).all();
      return Response.json(stress_history);
    },

  },
  async fetch(req) {
    const file = Bun.file("./public" + new URL(req.url).pathname);
    return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
  },

  development: true,
});

function init() {
    db.query(`
    CREATE TABLE IF NOT EXISTS storage(
        item TEXT,
        count INTEGER,
        time INTEGER,
	PRIMARY KEY(item, time)
    ) STRICT
    `).run();

    db.query(`
    CREATE TABLE IF NOT EXISTS stress(
        current INTEGER,
        max INTEGER,
        time INTEGER,
	PRIMARY KEY(time)
    ) STRICT
    `).run();
}
init();
console.log(`Listening on ${server.url}`);
