import { Database } from 'node:sqlite';
const database = new Database('database.db');

export function init() {
    database.exec(`
    CREATE TABLE IF NOT EXISTS storage(
        item TEXT,
        count INTEGER,
        time INTEGER,
	PRIMARY KEY(item, time)
    ) STRICT
    `);
}

export function insert_storage(item, count, time) {
    const insert = database.prepare('INSERT OR IGNORE INTO storage (item, count, time) VALUES (?, ?, ?)');
    insert.run(item, count, time);
    insert.close();
}

export function get_storage() {
    const query = database.prepare('SELECT * FROM storage ORDER BY item');
    const items =  query.all();
    query.close();
    return items;
}


