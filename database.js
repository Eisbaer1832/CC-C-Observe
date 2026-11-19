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

    database.exec(`
    CREATE TABLE IF NOT EXISTS stress(
        current INTEGER,
        max INTEGER,
        time INTEGER,
	PRIMARY KEY(time)
    ) STRICT
    `);
}

// stress 
export function insert_stress(current, max, time) {
    const insert = database.prepare('INSERT OR IGNORE INTO stress (current, max, time) VALUES (?, ?, ?)');
    insert.run(current, max, time);
    insert.close();
}

export function get_stress_history() {
    const query = database.prepare('SELECT * FROM stress');
    const items =  query.all();
    query.close();
    return items;
}

export function get_stress() {
    const query = database.prepare('SELECT *, MAX(time) FROM stress');
    const items =  query.all();
    query.close();
    return items;
}



// storage 
export function insert_storage(item, count, time) {
    const insert = database.prepare('INSERT OR IGNORE INTO storage (item, count, time) VALUES (?, ?, ?)');
    insert.run(item, count, time);
    insert.close();
}

export function get_storage_history() {
    const query = database.prepare('SELECT * FROM storage');
    const items =  query.all();
    query.close();
    return items;
}

export function get_storage() {
    const query = database.prepare('SELECT *, MAX(time) FROM storage GROUP BY item');
    const items =  query.all();
    query.close();
    return items;
}


