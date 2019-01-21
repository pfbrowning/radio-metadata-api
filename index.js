const express = require("express");
const internetRadio = require('node-internet-radio');
const app = express();
const port = 3000;

app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});

/**
 * Listen on /metadata/url for a metadata request.  This is
 * an API wrapper around the getStationInfo function provided
 * by https://www.npmjs.com/package/node-internet-radio.
 * 'url' should be the url-decoded radio station URL.
 * 'method' is an optional query param which specifies the stream
 * source method to query, as specified in the node-internet-radio
 * package readme.
 */
app.get("/metadata/:url", (req, res) => {
    internetRadio.getStationInfo(req.params.url, function(error, station) {
        // If there was an error, then report it back with a 500
        if(error) {
            res.status(500).send(error.message);
        }
        // If the call was successful, then return the data with a 200
        else {
            res.status(200).send(station);
        }
    /* Pass in query method in case the user provided a value.
    If nothing was provided, then getStationInfo will check all
    supported protocols, which is easy but inefficient. */
    }, req.query.method);
});