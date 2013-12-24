var api = require ('../lib/2gis-api');
var apiKey = require ('../api-key.json').key;
var apiVersion = 1.3;

api.configure({
    key: apiKey,
    version: apiVersion
});


exports['makeQueryParameter test']=function(test){
    test.equal(api.makeQueryParameter({
        what: 'пиво',
        bound:{
            point1: '37.432,55.836',
            point2: [37.633,55.637]
        },

        filters: {
            worktime: ['mon', '17:00']
        }

    }), 'what=пиво&bound[point1]=37.432,55.836&bound[point2]=37.633,55.637&filters[worktime]=mon,17:00');

    test.done();
};


exports['makeQueryStringByOptions test']=function(test){
    test.equal(api.makeQueryStringByOptions({
        what: 'пиво',
        bound:{
            point1: '37.432,55.836',
            point2: [37.633,55.637]
        }
    }), '?key=' + apiKey + '&version=' + apiVersion + '&output=json&what=пиво&bound[point1]=37.432,55.836&bound[point2]=37.633,55.637');

    test.done();
};

