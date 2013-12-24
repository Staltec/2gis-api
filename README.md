# 2GIS API for Node.js

## About module

This module implements [API 2GIS](http://api.2gis.ru/doc/) calls for NodeJS. At the moment the following sections API:
* Catalog API
* Geo data API

## Installation

    npm install 2gis-api

## Usage

```js
    var api = require ('2gis-api');

    api.configure({
        serviceUrl: 'catalog.api.2gis.ru', // This is optional default path.
        version: 1.3, // This is optional default version.

        key: 'YOUR_API_KEY' // Required. Get it from the vendor.
    });

    api.projectList({}, function (err, data) {
        console.log('projectList', err, data);
    });

    api.rubricator({
        where: 'Красноярск',
        show_children: 1
    }, function (err, data) {
        console.log('rubricator', err, data);
    });

```
Important! To obtain the API-key necessary to fill in the [application form](http://partner.api.2gis.ru/).

## Catalog API

### "projectList"
The method returns a list of projects (a large city and surrounding villages). Values ​​of incoming and outgoing parameters are listed in the [API method documentation](http://api.2gis.ru/doc/firms/list/project-list/).

### "rubricator"
Selects rubrics for which this rubric is the parent. [API method documentation](http://api.2gis.ru/doc/firms/list/rubricator/).

### "search"
Searches for firms from the given query and displays a list of found results paginated. [API method documentation](http://api.2gis.ru/doc/firms/searches/search/).

### "firms"
Alias of `search`.

### "searchInRubric"
Searches for the given query firms in this category and gives the list of matches paginated. [API method documentation](http://api.2gis.ru/doc/firms/searches/searchinrubric/).

### "firmsByFilialId"
Returns a list of offices of the company by a unique identifier. [API method documentation](http://api.2gis.ru/doc/firms/searches/firmsbyfilialid/).

### "adsSearch"
Searches for advertisers within a given query. [API method documentation](http://api.2gis.ru/doc/firms/searches/adssearch/).

### "ads"
Alias of `adsSearch`.

### "profile"
Returns detailed information about the profile of the branch by its unique identifier. [API method documentation](http://api.2gis.ru/doc/firms/profiles/profile/).

### "firmProfile"
Alias of `profile`.

## Geo data API

### "geoSearch"
Selects geoobjects that match the search criteria. [API method documentation](http://api.2gis.ru/doc/geo/search/).

### "geoGet"
Returns information about the geo object by its identifier. [API method documentation](http://api.2gis.ru/doc/geo/get/).

## Features of the implementation under Node.js
* query parameters with commas in the original API can be represented as an array:
```js
    ...
    api.firms({
        what: 'установка окон',

        filters: {
            worktime: ['sat', '15:00'] // <- This is it.
        }

    }, function (err, data) {
        console.log('firms', err, data);
    });
    ...
```
* complex structure of the form `bound [point1] = 37.432,55.836 & bound [point2] = 37.633,55.637` can be represented as an object:
```js
    ...
    api.firms({
        what: 'установка окон',

        bound: {
                point1: '37.432,55.836', // <- This is it...
                point2: [37.633, 55.637] // <- Or an array.
            }

    }, function (err, data) {
        console.log('firms', err, data);
    });
    ...
```

## Issues

Have a bug? Please create an issue here on GitHub!

https://github.com/Staltec/2gis-api/issues

## License

(The MIT License)

Copyright (c) 2013 Alexander Prozorov (staltec@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
