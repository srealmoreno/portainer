import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

const name = process.env.NAME || 'Alvaro cochon';

app.get('/', (req, res) => {
  res.send(`<h1>Hello ${name}, welcome to the API!</h1>`);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
