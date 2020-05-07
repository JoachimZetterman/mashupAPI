var router = require('express').Router();
var got = require('got')

//http://localhost:3000/api/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da

router.get('/artist/:mbid', async (req, res, next) => {

    //For measurment of API performance
    timeStarted = new Date().getTime();
    
    try {
        var respMusicBrainz = await got("http://musicbrainz.org/ws/2/artist/" + req.params.mbid + "?&fmt=json&inc=url-rels+release-groups")
        
        //Parsing the body as it's interperted as a string
        respMusicBrainz = JSON.parse(respMusicBrainz.body)
      
        var wikiRelation

        for (const r of respMusicBrainz.relations) {
            if(r.type === "wikidata"){
                wikiRelation = r
            }
            else if(r.type === "wikipedia"){
                wikiRelation = r
            }
        }

        var respWikipedia = await wikiSender(wikiRelation)

        var respCoverArtArchive = await coverArtSender(respMusicBrainz["release-groups"])

        //Artist object to be returned to user. TODO: Use modell Artist
        var artist = 
            {
                "mbid": req.params.mbid,
                "description": respWikipedia.description,
                "albums": respCoverArtArchive.albums
            }   
    }
    catch (e){ 
        console.error(e.stack)
        res.status(500).send('Something broke!')
    }
    
    var timeTaken = new Date().getTime() - timeStarted;
    console.log("Finished with request. Time: " + timeTaken + "ms") 

    res.send(artist)
});

async function wikiSender(wikiObject){

    //TODO: Add url to process.env or config.json, break upp parameters aswell since everything is hardcoded.
    const urlWikipedia = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles="
    
    if(wikiObject.type === "wikidata"){

        //Parse out the ID Q11649 e.g.
        //https://www.wikidata.org/wiki/Q11649
        var id = wikiObject.url.resource.split("/").pop().toString()
        
        var respWikidata = await got("https://www.wikidata.org/w/api.php?action=wbgetentities&ids=" + id + "&format=json&props=sitelinks")

        respWikidata = JSON.parse(respWikidata.body)

        //Encode URL as it can contain whitespace
        var respWikipedia = await got(urlWikipedia + encodeURI(respWikidata.entities[id].sitelinks.enwiki.title))
       
        respWikipedia = JSON.parse(respWikipedia.body)

        var description = descriptionParser(respWikipedia.query.pages[Object.keys(respWikipedia.query.pages)[0]].extract)
    }
    else if (wikiObject.type === "wikipedia"){
        //TODO: More test cases needed for this statement. 
        
        //Assumees url contains Nirvana_(band) or Nirvana%20(band) as it should be valid
        var title = wikiObject.url.resource.split("=").pop()

        var respWikipedia = await got(urlWikipedia + title)

        var description = descriptionParser(respWikipedia.query.pages[Object.keys(respWikipedia.query.pages)[0]].extract)
    }

    return {"description": description}
}

async function coverArtSender(releaseGroup){
    //releaseGroup = array of albums with mbid/id and title for each album

    var url = "http://coverartarchive.org/release-group/"
    var albums = []
    var imageURI, imageResp, albums

    for (const i of releaseGroup) {
        try{
            //TODO: Currently blocking... Should probably beed handled async and handle in parralell... 
            imageResp = await got(url + i.id)
            imageURI = JSON.parse(imageResp.body).images[0].image
        }
        catch{
            imageURI = "No image"
        }
       
        album = {
            "title": i.title,
            "id": i.id,
            "image": imageURI
        }

        albums.push(album)
    }
    return {"albums": albums}
}

function descriptionParser(description){
    //TODO: Fix. Works good for Nirvana but not sure how the API works for all MIDS. To much spliting and trimming for my likning. 
    return description.split("<p>")[1].split("</p>")[0].trim()
}

module.exports = router;