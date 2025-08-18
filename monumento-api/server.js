const express = require('express');
let monuments = require('mock-monument.js');

const app = express(); 
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//app.METHOD(CHEMIN, GESTIONNAIRE(req, res))

app.get('/monuments/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Vous avez demandé des informations sur le monument avec l'ID: ${id}`);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
