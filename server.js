const express = require('express');
const app = express();
const PORT = 3000;

app.post('/', (req, res) => {
  console.log(req);
  res.send('Thanks!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})