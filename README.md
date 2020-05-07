# MashupAPI

A simple mashup api for artist information such as description, albums e.g. created in Node.js with Express framework.

## Getting Started

Unzip project or git clone https://github.com/JoachimZetterman/mashupAPI.git
npm install 
npm start

## Example API call

Information about Nirvana using MBID:  
curl http://localhost:3000/api/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da

## Running the tests

npm run test 

## TODO

07/05/2020
- Improve performance. Currently around 15-20 sec due to blocking parts were API calls are being chained...
- Write more unit tests
- Refactor some got calls in artist route into functions for better structure, clarity and reusability
- Implement Artist model instead

## Built With

* [Node.js](https://nodejs.org/dist/latest-v12.x/docs/api/) - Runtime
* [Express.js](https://expressjs.com/en/4x/api.html) - Web application framework
* [got](https://www.npmjs.com/package/got) - HTTP request libary
* [jest](https://jestjs.io/docs/en/apit) - Testing framework

## Author

* **Joachim Zetterman**

## License

This project is licensed under the MIT License