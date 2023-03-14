const express = require('express')
const app = express()
const etag = require('etag')
const fs = require('fs')

app.get('/', (req, res) => {
  fs.readFile('./data.json', 'utf-8', (err, data) => {
    if (err) throw err
    let jsonData = JSON.parse(data)

    //saat client pertama kali mengakses server, akan di generate strong etag
    const strongEtag = etag(data, { weak: false })

    // jika data belum berubah maka akan di beri respon weak etag
    const weakEtag = etag(data, { weak: true })
    
    // Menampung Etag saat pertama kali dibuat oleh server (ada di client)
    const notMatch = req.headers['if-none-match']
  
    // jika etag pada client sama dengan etag server
    if (notMatch && (notMatch === strongEtag || notMatch === weakEtag)) {
      return res.sendStatus(304)
    }
    // jika tidak, buat etag baru
    res.set({
        // membuat random hash
        'ETag': strongEtag,
        // cache expire dalam 60 detik
        'Cache-Control': 'public, max-age=60'
      })
    res.send(jsonData)
  })
})

app.listen(6060, () => {
  console.log('Example app listening on port 6060!')
})
