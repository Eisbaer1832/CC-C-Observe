import { serve, sql } from "bun";
import { Database } from "bun:sqlite";

const db = new Database("database.db");

const server = serve({
  routes: {

    // stock api 
    "/api/stock": {
      async GET(req) {
        const stock = await db.query(`SELECT * FROM storage WHERE time = (SELECT MAX(time) FROM storage AS s2 WHERE s2.item = storage.item)`).all();
        return Response.json(stock);
      },

      async POST(req) {
        const data = await req.body.split(", ");
        for (let i = 0; i < data.length; i++) {
            let item = data[i].split(" x")
            db.query(`INSERT INTO storage (item, count, time) VALUES (${item[0]}, ${item[1]}, ${time})`).run()
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
            const stress = await db.query(`SELECT *, MAX(time) FROM stress`).all();
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
