var artistService = require('./../services/artistService.js');

describe("Function that gets cover art for album with provided id", () => {
    test("it should give a image link, id and title", async () => {
        
        const input = 
        [
            {
                "first-release-date": "1993",
                "id": "178b993e-fa9c-36d3-9d73-c5a8ba0c748d",
                "secondary-type-ids": [
                    "dd2a21e1-0c00-3729-a7a0-de60b84eb5d1"
                ],
                "secondary-types": [
                    "Compilation"
                ],
                "primary-type": "Album",
                "primary-type-id": "f529b476-6e62-324f-b0aa-1f3e33d313fc",
                "disambiguation": "",
                "title": "Wipeout"
            }
        ]

        const output = 
        [{
            "title": "Wipeout",
            "id": "178b993e-fa9c-36d3-9d73-c5a8ba0c748d",
            "image": "http://coverartarchive.org/release/00681632-b53b-4aae-89c2-470150f33fe3/1898023189.jpg"
        }]

        await expect((await artistService.coverArtSender(input)).albums).toEqual(output);
  
    });
});