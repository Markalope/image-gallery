require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pg = require('pg');
const client = require('./db-client');

//ROUTE: Get summary data
app.get('/api/stats', (req, res, next) => {
  client.query(`
  SELECT 
    MAX (count),
    ROUND (AVG (count), 2) as average,
    MIN (count),
    COUNT (count)
  FROM 
  (
    SELECT albums.id, albums.title, albums.description, COUNT(images.id) as count
    FROM images
    LEFT JOIN albums on albums.id = images.album_id
    GROUP BY albums.id
    ORDER BY albums.title
  ) as count_query; 
`).then(result => {
    res.send(result.rows[0]);
  })
    .catch(next);
});

// ROUTE:  Get all albums
app.get('/api/albums', (req, res, next) => {
  client.query(`
    SELECT COUNT(*) count, albums.id, albums.title, albums.description
    FROM images
    LEFT JOIN albums on albums.id = images.album_id
    GROUP BY albums.id, albums.title, albums.description
    ORDER BY albums.title;
  `).then(result => {
    res.send(result.rows);
  })
    .catch(next);
});

// ROUTE:  Get a single album
app.get('/api/albums/:id', (req, res, next) => {
  client.query(`
    SELECT id,
    title,
    description
  FROM albums
  WHERE id = $1;
  `,
  [req.params.id]
  ).then(result => {
    res.send(result.rows[0]);
  })
    .catch(next);
});


// ROUTE:  Get the images for a specific album
app.get('/api/images/:id', (req, res, next) => {
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
  })
    .catch(next);
});

// ROUTE:  Post to images
app.post('/api/images', (req, res, next) => {
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
  })
    .catch(next);
});

// ROUTE:  Post to albums
app.post('/api/albums', (req, res, next) => {
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
  })
    .catch(next);
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
  console.log('***SERVER ERROR**\n', err);
  let message = 'internal server error';
  if(err.message) message = err.message;
  else if(typeof err === 'string') message = err;
  res.status(500).send({ message });
});

app.listen(3000, () => console.log('server running ...'));