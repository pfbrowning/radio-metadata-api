# Radio Metadata API
[![Build Status](https://toxicbard.visualstudio.com/Browninglogic%20Radio/_apis/build/status/radio-metadata-api%20-%20CI?branchName=master)](https://toxicbard.visualstudio.com/Browninglogic%20Radio/_build/latest?definitionId=1&branchName=master)

## Introduction
Radio Metadata API is a simple Node.JS API which queries the provided internet radio URL and looks up the "Now Playing" metadata.  It provides an GET endpoint around the getStationInfo function provided by [node-internet-radio](https://www.npmjs.com/package/node-internet-radio) library.

It's primarily intended for use by [Browninglogic Radio](https://github.com/pfbrowning/ng-radio), but it's intentionally decoupled in order to be of use to any other consumers which might also find it useful.

## Usage
Clone the git repo, run `npm i` to install dependencies, and run `npm start` to run the API locally.
Then perform an HTTP GET on `http://localhost:3000/now-playing?url=encoded-station-url&method=method`.

The 'method' parameter is optional, but encouraged.  As explained in the [node-internet-radio](https://www.npmjs.com/package/node-internet-radio) readme, if method is not provided, then the getStationInfo function will check all supported methods (protocols) to see which one returns a valid value.  This is easy, but very inefficient.  The ideal approach if you don't already know the method / protocol to pass in is to first query using the URL only, then store the returned "fetchsource" on the client, and then pass it in as 'method' on subsequent calls for the same stream.

## Example
Let's say that I want to get the metadata for the stream located at `http://188.165.212.92:8000/heavy128mp3`, but I don't know what protocol the stream uses.  I would first encode the URL and then GET from `http://localhost:3000/now-playing?url=http%3A%2F%2F188.165.212.92%3A8000%2Fheavy128mp3`.  This gives me a response of:
```json
{
    "title": "Gamma Ray - Farewell (Live in Bochum)",
    "fetchsource": "STREAM",
    "headers": {
        "icy-notice1": "<BR>This stream requires <a href=\"http",
        "icy-notice2": "SHOUTcast DNAS/posix(linux x64) v2.5.1.724<BR>",
        "icy-name": "RADIO METAL ON",
        "icy-genre": "Heavy Metal, Metal, Hard Rock",
        "icy-br": "128",
        "icy-sr": "44100",
        "icy-url": "http",
        "icy-pub": "1",
        "content-type": "audio/mpeg",
        "icy-metaint": "8192"
    }
}
```
I can now take note that "fetchsource" returns a value of "STREAM".  Now I know that if I want to make any subsequent metadata calls for the same station, I can add the "method=STREAM" parameter to the end of my GET request, as such: `http://localhost:3000/now-playing?url=http%3A%2F%2F188.165.212.92%3A8000%2Fheavy128mp3&method=stream`.

## Swagger
The Swagger documentation can be accessed from `/swagger`.  For example, you can simply navigate to `http://localhost:3000/swagger` while running locally.

## CORS
CORS is enabled for all origins by default.  If you would like to limit the allowed CORS origins, then specify the origins that you want to allow in the allowedCorsOrigins environment value as a *valid JSON array*.

For example, if I want to specifically allow only the `http://localhost:4200` and `http://publishedspa.com` origins, I would store `["http://localhost:4200","http://publishedspa.com"]` in the `allowedCorsOrigins` environment variable.

## Authentication
If you supply `issuer` and `audience` as environment variables, the API will require
a valid standard RS-256 JWT access token.  This is optional: if you don't provide these
environment variables, the API will be publicly accessible.

## Roadmap For 1.0.0
* Write JSDoc comments for function exports
* App Insights logging
* Test Coverage badge