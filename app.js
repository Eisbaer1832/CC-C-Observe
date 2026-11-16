import express from 'express';
import {init, insert_storage, get_storage} from  "./database.js";

const app = express();
const port = 3333;

app.use(express.text({ type: '*/*' }));

init()

app.get('/', (req, res) => {
    res.send('Hello World!');
});

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
