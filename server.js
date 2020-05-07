const express = require('express')
const app = express()
const port = 3000

require('./models/Artist');

app.use(require('./routes'));

app.use(function (err, req, res, next) {
    res.status(500).send('Something broke!')
})

app.listen(port, () => console.log(`Mashup API server listening on port ${port}!`))




/*

Post med MBID

Get musicbrainz
    check relation -> 
        type = wikidata,  return id from musicbrainz (Q11649)
        
        type = wikipedia, return name (Nirvana%20(band))


    release-groups: list of albums (MBID, title)

if( wikidata )
    name = get wikidata(id)    (sitelinks-> enwiki -> title -> Nirvana (band) --> Nirvana%20(band))
    description = get wikipedia(name)
    
if(wikipedia)
    description = get wikipedia(name)

get coverArt(MBID of albums)

Return to user:
{
    "mbid": 
    "description":
    "albums": [
        {
            "title":
            "id":
            "image":
        }
    ]
}



*/
