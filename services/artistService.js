var got = require('got')

//Artist service
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

module.exports = {coverArtSender}