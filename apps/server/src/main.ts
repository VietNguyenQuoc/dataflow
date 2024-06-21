import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers['origin'] || '*');
  res.setHeader('Access-Control-Allow-Method', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API hihi' });
});

let storedFullName = '';
app.post('/user', (req, res) => {
  const { fullName } = req.body;

  const previous = storedFullName;
  storedFullName = fullName;

  res.send(`Updated full name from ${previous} to ${fullName}`);
});
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
