import express from 'express';
import {init, insert_stress, get_stress_history, get_stress, insert_storage, get_storage, get_storage_history} from  "./database.js";

const app = express();
const port = 3333;

app.use(express.text({ type: '*/*' }));

init()

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// sress
app.put('/api/stress/current/:current/max/:max', (req, res) => {
    const time = Date.now()
    insert_stress(req.params.current, req.params.max, time)
    res.send("success");
});

app.get('/api/stress', (req, res) => {
    const storage = get_stress()
    res.send(storage);
});

app.get('/api/stress/history', (req, res) => {
    const storage = get_stress_history()
    res.send(storage);
});


// stock 
app.post('/api/stock', (req, res) => {
    const time = Date.now()
    const data = req.body.split(", ");
    for (let i = 0; i < data.length; i++) {
        let item = data[i].split(" x")
        insert_storage(item[0], item[1], time)
    }
    res.send("success");
});

app.get('/api/stock', (req, res) => {
    const storage = get_storage()
    res.send(storage);
});

app.get('/api/stock/history', (req, res) => {
    const storage = get_storage_history()
    res.send(storage);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
