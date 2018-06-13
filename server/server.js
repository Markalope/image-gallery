const express = require('express');
const app = express();

const cors =  require('cors');
app.use(cors());
app.use(express.json());

const pg = require('pg');
const client = require('./db-client');

// ROUTE:  Get all albums
app.get('/api/albums', (req, res) => {
  client.query(`
    SELECT id,
    title,
    description
  FROM albums
  ORDER BY title;
  `).then(result => {
    res.send(result.rows);
  });
});

// ROUTE:  Get the images for a specific album
app.get('/api/images/:id', (req, res) => {
  client.query(`
    SELECT id,
    album_id,
    title,
    description,
    url
  FROM images
  WHERE album_id = $1
  ORDER BY title;
  `,
  [req.params.id]
    ).then(result => {
    res.send(result.rows);
    });
});

// ROUTE:  Post to images
app.post('/api/images', (req, res) => {
  const body = req.body;
  client.query(`
    INSERT INTO images (title, url, description, album_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `,
  [body.title, body.url, body.description, body.albumId]
  ).then(result => {
      // send back object
      res.send(result.rows[0]);
    });
});

// ROUTE:  Post to albums
app.post('/api/albums', (req, res) => {
  const body = req.body;
  client.query(`
    INSERT INTO albums (title, description)
    VALUES ($1, $2)
    RETURNING *;
  `,
  [body.title, body.description]
  ).then(result => {
      // send back object
      res.send(result.rows[0]);
    });
});

app.listen(3000, () => console.log('server running ...'));