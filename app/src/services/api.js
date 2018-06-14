const URL = '/api';
const ALBUMS_URL = `${URL}/albums`;
const IMAGES_URL = `${URL}/images`;
const STATS_URL = `${URL}/stats`;

function responseHandler(response) {
  if(response.ok) return response.json();
  return response.json().then(err => { 
    throw err.message; 
  });
}

export function getStats() {
  return fetch(STATS_URL, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(responseHandler);
}

export function getAlbums() {
  return fetch(ALBUMS_URL, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(responseHandler);
}

export function getAlbum(albumId) {
  return fetch(`${ALBUMS_URL}/${albumId}`, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(responseHandler);
}

export function getImages(albumId){
  return fetch(`${IMAGES_URL}/${albumId}`, {
    headers: { 'Content-Type': 'application/json' }      
  })
    .then(responseHandler);
}

export function addImage(image){
  return fetch(IMAGES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(image)    
  })
    .then(responseHandler);
}

export function addAlbum(album){
  return fetch(ALBUMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(album)    
  })
    .then(responseHandler);
}