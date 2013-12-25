
var http = require('http');
var _ = require ('lodash');

var DEFAULT_API_VERSION = 1.3;
var DEFAULT_SERVICE_URL = 'catalog.api.2gis.ru';

var NAMESPACE_PROJECT_LIST          = '/project/list';      // Проекты
var NAMESPACE_RUBRICATOR            = '/rubricator';        // Рубрики

var NAMESPACE_FIRM_SEARCH           = '/search';            // Поиск фирм
var NAMESPACE_FIRM_SEARCH_IN_RUBRIC = '/searchinrubric';    // Поиск фирм в рубрике
var NAMESPACE_FIRMS_BY_FILIAL_ID    = '/firmsByFilialId';   // Филиалы фирмы
var NAMESPACE_FIRM_ADS_SEARCH       = '/ads/search';        // Поиск рекламы
var NAMESPACE_FIRM_PROFILE          = '/profile';           // Профиль фирмы

var NAMESPACE_GEO_SEARCH            = '/geo/search';        // Поиск геообъектов
var NAMESPACE_GEO_GET               = '/geo/get';           // Информация о геообъекте

var serviceUrl;
var commonOptions = {
    key: '',
    version: DEFAULT_API_VERSION,
    output: 'json'
};


exports.configure = function(options) {
    //
    serviceUrl = options.serviceUrl || DEFAULT_SERVICE_URL;

    // Common api options
    commonOptions.key = options.key || '';
    commonOptions.version = options.version || DEFAULT_API_VERSION;
};


/* Get projects and rubric */

exports.projectList = function (options, callback) {
    doRequest (NAMESPACE_PROJECT_LIST, options, callback);
};

exports.rubricator = function (options, callback) {
    doRequest (NAMESPACE_RUBRICATOR, options, callback);
};


/* Search firm */

exports.search = function (options, callback) {
    doRequest (NAMESPACE_FIRM_SEARCH, options, callback);
};
exports.firms = exports.search;

exports.searchInRubric = function (options, callback) {
    doRequest (NAMESPACE_FIRM_SEARCH_IN_RUBRIC, options, callback)
};

exports.firmsByFilialId = function (options, callback) {
    doRequest (NAMESPACE_FIRMS_BY_FILIAL_ID, options, callback)
};

exports.adsSearch = function (options, callback) {
    doRequest (NAMESPACE_FIRM_ADS_SEARCH, options, callback)
};
exports.ads = exports.adsSearch;

exports.profile = function (options, callback) {
    doRequest (NAMESPACE_FIRM_PROFILE, options, callback)
};
exports.firmProfile = exports.profile;


/* API geo data */

exports.geoSearch = function (options, callback) {
    doRequest (NAMESPACE_GEO_SEARCH, options, callback)
};

exports.geoGet = function (options, callback) {
    doRequest (NAMESPACE_GEO_GET, options, callback)
};


/* Common functions */

function makeQueryParameter (val, key, parent_key) {
    parent_key = parent_key || '';

    if(_.isPlainObject(val)){
        var params = [];
        _.forOwn(val, function(v,k){
            params.push(makeQueryParameter(v, k, parent_key ? parent_key + '['+key+']' : key));
        });
        return params.join('&');
    } else if(_.isArray(val)) {
        val = val.join();
    }

    if(parent_key) {
        key = '[' + key + ']';
    }

    return parent_key + key + '=' + val;
}

function makeQueryStringByOptions (options) {
    var fullOptions = _.extend(commonOptions, options || {});

    var params = [];
    _.forOwn(fullOptions, function(val, key) {
        params.push(makeQueryParameter(val, key));
    });

    var paramStr = params.join('&');

    return paramStr ? '?' + paramStr : '';
}


function doHttpRequest (requestObj, callback) {

    http.request (requestObj, function onRequestResponse (response) {
        var data = '';

        response.on('data', function (chunk) {
            data += chunk;
        });

        response.on('end', function () {
            callback && callback (null, data);
        });

    })
        .on('error', function onRequestError (e) {
            callback && callback (e);
        })
        .end();
}


function doRequest (namespace, options, onRequestDataCallback) {

    var requestPath = namespace + makeQueryStringByOptions(options);
    var requestObj = {
        host: serviceUrl,
        path: requestPath
    };

    exports.getFromCache (requestPath, function(err, cached_data) {

        if(!err && cached_data && _.isPlainObject(cached_data)) {
            onRequestDataCallback(null, cached_data);
        } else {
            doHttpRequest (requestObj, function(err, raw_data){

                if(!err) {
                    try {
                        var parsed_data = JSON.parse(raw_data);
                        onRequestDataCallback (null, parsed_data);
                        exports.pushToCache(requestPath, raw_data);
                    } catch (e) {
                        onRequestDataCallback (e);
                    }
                } else {
                    onRequestDataCallback (err);
                }

            });
        }

    });

}

/* Cache overridden functions */

exports.getFromCache = function  (requestPath, callback) {
    // Can be overridden to receive data from a third-party caching service.
    // Must return error object and data as plain object or null.
    callback (null, null);
};

exports.pushToCache = function (requestPath, data){
    // Can be overridden to push data into a third-party caching service.
};


/* External aliases for unit test */
exports.makeQueryParameter = makeQueryParameter;
exports.makeQueryStringByOptions = makeQueryStringByOptions;
