import express from "express";

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Gatto Ninja!'));

app.listen(port, () => console.log(`Initial commit. On port: ${port}!`));
