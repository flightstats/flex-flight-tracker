var Airport = function(airportData, config) {
	this.name = airportData.name;
	this.classification = airportData.classification;
	this.lat = airportData.latitude;
	this.lon = airportData.longitude;
	this.icon = config.icon;
};
var Flex = function(config) {
  if (config == null) {
  	throw new Error('flex config required');
  }
  if (config.appId == null || config.appKey == null) {
  	throw new Error("flex appId and appKey required");
  }

  this.appId = config.appId;
  this.appKey = config.appKey;
  this.fsBasePath = 'https://api.flightstats.com/flex/';
};

Flex.prototype.fetchAirportByCode = function(fsAirportCode, options, done) {
	/* 
	Options:
	  - extendedOptions
	See https://developer.flightstats.com/api-docs/airports/v1
	*/

	var airportPath = [
	  this.fsBasePath,
	  'airports/rest/v1/jsonp/',
	  fsAirportCode,
	  '/today',
	  '?appId=',
	  this.appId,
	  '&appKey=',
	  this.appKey
	];

	for (var option in options) {
	  airportPath.push('&');
	  airportPath.push(option);
	  airportPath.push('=');
	  airportPath.push(options[option]);
	}

	airportPath = airportPath.join('');

	jsonpRequest(airportPath, "callback", function(err, response) {
	  done(err, response);
	});
};

Flex.prototype.fetchActiveOutgoingFlightsForAirport = function(fsAirportCode, options, done) {
	/* 
	Options:
	  - carrier
	  - includeFlightPlan
	  - maxPositions
	  - maxPositionAgeMinutes
	  - codeType
	  - maxFlights
	  - extendedOptions
	See https://developer.flightstats.com/api-docs/flightstatus/v2/airport for documentation
	*/

	var airportPath = [
	  this.fsBasePath,
	  'flightstatus/rest/v2/jsonp/airport/tracks/',
	  fsAirportCode,
	  '/dep?appId=',
	  this.appId,
	  '&appKey=',
	  this.appKey
	];

	for (var option in options) {
		airportPath.push('&');
		airportPath.push(option);
		airportPath.push('=');
		airportPath.push(options[option]);
	}

	airportPath = airportPath.join('');

	jsonpRequest(airportPath, "callback", function(err, response) {
		done(err, response);
	});
};

Flex.prototype.fetchActiveIncomingFlightsForAirport = function(fsAirportCode, options, done) {
	/* 
	Options:
	  - carrier
	  - includeFlightPlan
	  - maxPositions
	  - maxPositionAgeMinutes
	  - codeType
	  - maxFlights
	  - extendedOptions
	See https://developer.flightstats.com/api-docs/flightstatus/v2/airport for documentation
	*/

	var airportPath = [
	  this.fsBasePath,
	  'flightstatus/rest/v2/jsonp/airport/tracks/',
	  fsAirportCode,
	  '/arr?appId=',
	  this.appId,
	  '&appKey=',
	  this.appKey
	];

	for (var option in options) {
		airportPath.push('&');
		airportPath.push(option);
		airportPath.push('=');
		airportPath.push(options[option]);
	}

	airportPath = airportPath.join('');

	jsonpRequest(airportPath, "callback", function(err, response) {
		done(err, response);
	});
};

Flex.prototype.fetchFlightTracksForFlight = function(flightId, options, done) {
	// console.log("fetchFlightTracksForFlight");
	/* 
	Options:
	  - includeFlightPlan
	  - maxPositions
	  - maxPositionAgeMinutes
	  - extendedOptions
	See https://developer.flightstats.com/api-docs/flightstatus/v2/flight for documentation
	*/

	var flightPath = [
	  this.fsBasePath,
	  'flightstatus/rest/v2/jsonp/flight/track/',
	  flightId,
	  '?appId=',
	  this.appId,
	  '&appKey=',
	  this.appKey
	];

	for (var option in options) {
		flightPath.push('&');
		flightPath.push(option);
		flightPath.push('=');
		flightPath.push(options[option]);
	}
	  	
	flightPath = flightPath.join('');

	// var res = {"request":{"flightId":{"requested":"397615388","interpreted":397615388},"includeFlightPlan":{"requested":"true","interpreted":true},"maxPositions":{},"maxPositionAgeMinutes":{},"extendedOptions":{},"url":"https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/track/397615388"},"appendix":{"airlines":[{"fs":"DL","iata":"DL","icao":"DAL","name":"Delta Air Lines","phoneNumber":"1-800-221-1212","active":true}],"airports":[{"fs":"PDX","iata":"PDX","icao":"KPDX","faa":"PDX","name":"Portland International Airport","street1":"7000 NE Airport Way","city":"Portland","cityCode":"PDX","stateCode":"OR","postalCode":"97218","countryCode":"US","countryName":"United States","regionName":"North America","timeZoneRegionName":"America/Los_Angeles","weatherZone":"ORZ006","localTime":"2014-06-30T12:38:17.031","utcOffsetHours":-7.0,"latitude":45.588995,"longitude":-122.592901,"elevationFeet":30,"classification":1,"active":true,"delayIndexUrl":"https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/PDX?codeType=fs","weatherUrl":"https://api.flightstats.com/flex/weather/rest/v1/json/all/PDX?codeType=fs"},{"fs":"MSP","iata":"MSP","icao":"KMSP","faa":"MSP","name":"Minneapolis-St. Paul International Airport","street1":"6040 28th Avenue South","city":"Minneapolis","cityCode":"MSP","stateCode":"MN","postalCode":"55450","countryCode":"US","countryName":"United States","regionName":"North America","timeZoneRegionName":"America/Chicago","weatherZone":"MNZ060","localTime":"2014-06-30T14:38:17.031","utcOffsetHours":-5.0,"latitude":44.883016,"longitude":-93.210922,"elevationFeet":841,"classification":1,"active":true,"delayIndexUrl":"https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/MSP?codeType=fs","weatherUrl":"https://api.flightstats.com/flex/weather/rest/v1/json/all/MSP?codeType=fs"}]},"flightTrack":{"flightId":397615388,"carrierFsCode":"DL","flightNumber":"2200","departureAirportFsCode":"PDX","arrivalAirportFsCode":"MSP","departureDate":{"dateLocal":"2014-06-30T11:28:00.000","dateUtc":"2014-06-30T18:28:00.000Z"},"equipment":"A320","bearing":86.98494740469317,"heading":89.59386132012935,"positions":[{"lon":-112.8783,"lat":45.8631,"speedMph":573,"altitudeFt":33100,"source":"ASDI","date":"2014-06-30T19:27:14.000Z"},{"lon":-113.0803,"lat":45.8622,"speedMph":578,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T19:26:12.000Z"},{"lon":-113.2831,"lat":45.8614,"speedMph":583,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:25:10.000Z"},{"lon":-113.5022,"lat":45.86,"speedMph":588,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:24:08.000Z"},{"lon":-113.7425,"lat":45.8589,"speedMph":586,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:23:06.000Z"},{"lon":-113.7822,"lat":45.8586,"speedMph":587,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:22:49.000Z"},{"lon":-113.9453,"lat":45.8578,"speedMph":583,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:22:04.000Z"},{"lon":-113.9856,"lat":45.8575,"speedMph":585,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:21:48.000Z"},{"lon":-114.1492,"lat":45.8558,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:21:01.000Z"},{"lon":-114.1881,"lat":45.8542,"speedMph":583,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:20:47.000Z"},{"lon":-114.3494,"lat":45.8528,"speedMph":583,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:19:59.000Z"},{"lon":-114.3892,"lat":45.8522,"speedMph":583,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:19:45.000Z"},{"lon":-114.5439,"lat":45.8494,"speedMph":583,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:18:57.000Z"},{"lon":-114.5831,"lat":45.8494,"speedMph":582,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:18:44.000Z"},{"lon":-114.7456,"lat":45.8464,"speedMph":585,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:17:55.000Z"},{"lon":-114.7853,"lat":45.8456,"speedMph":582,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:17:43.000Z"},{"lon":-114.9869,"lat":45.8422,"speedMph":586,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:16:53.000Z"},{"lon":-115.0261,"lat":45.8411,"speedMph":582,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:16:41.000Z"},{"lon":-115.1875,"lat":45.8375,"speedMph":588,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:15:51.000Z"},{"lon":-115.2278,"lat":45.8369,"speedMph":582,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:15:40.000Z"},{"lon":-115.2278,"lat":45.8369,"speedMph":582,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:15:40.000Z"},{"lon":-115.3883,"lat":45.8342,"speedMph":589,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:14:49.000Z"},{"lon":-115.3883,"lat":45.8342,"speedMph":589,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:14:49.000Z"},{"lon":-115.4289,"lat":45.8325,"speedMph":583,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:14:39.000Z"},{"lon":-115.4289,"lat":45.8325,"speedMph":583,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:14:39.000Z"},{"lon":-115.5967,"lat":45.8306,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:13:47.000Z"},{"lon":-115.5967,"lat":45.8306,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:13:47.000Z"},{"lon":-115.5967,"lat":45.8306,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:13:47.000Z"},{"lon":-115.6339,"lat":45.8278,"speedMph":585,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:13:37.000Z"},{"lon":-115.6339,"lat":45.8278,"speedMph":585,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:13:37.000Z"},{"lon":-115.6339,"lat":45.8278,"speedMph":585,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:13:37.000Z"},{"lon":-115.8006,"lat":45.8253,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:12:45.000Z"},{"lon":-115.8006,"lat":45.8253,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:12:45.000Z"},{"lon":-115.8006,"lat":45.8253,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:12:45.000Z"},{"lon":-115.8364,"lat":45.8231,"speedMph":583,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:12:36.000Z"},{"lon":-115.8364,"lat":45.8231,"speedMph":583,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:12:36.000Z"},{"lon":-115.8364,"lat":45.8231,"speedMph":583,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:12:36.000Z"},{"lon":-116.0006,"lat":45.8192,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:11:43.000Z"},{"lon":-116.0006,"lat":45.8192,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:11:43.000Z"},{"lon":-116.0006,"lat":45.8192,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:11:43.000Z"},{"lon":-116.0378,"lat":45.8172,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:11:35.000Z"},{"lon":-116.0378,"lat":45.8172,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:11:35.000Z"},{"lon":-116.0378,"lat":45.8172,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:11:35.000Z"},{"lon":-116.2414,"lat":45.8122,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:10:41.000Z"},{"lon":-116.2414,"lat":45.8122,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:10:41.000Z"},{"lon":-116.2414,"lat":45.8122,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:10:41.000Z"},{"lon":-116.2389,"lat":45.8114,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:10:34.000Z"},{"lon":-116.2389,"lat":45.8114,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:10:34.000Z"},{"lon":-116.2389,"lat":45.8114,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:10:34.000Z"},{"lon":-116.4439,"lat":45.8058,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:09:39.000Z"},{"lon":-116.4439,"lat":45.8058,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:09:39.000Z"},{"lon":-116.4439,"lat":45.8058,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:09:39.000Z"},{"lon":-116.4414,"lat":45.805,"speedMph":581,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:09:32.000Z"},{"lon":-116.4414,"lat":45.805,"speedMph":581,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:09:32.000Z"},{"lon":-116.4414,"lat":45.805,"speedMph":581,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:09:32.000Z"},{"lon":-116.6444,"lat":45.7992,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:08:37.000Z"},{"lon":-116.6444,"lat":45.7992,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:08:37.000Z"},{"lon":-116.6444,"lat":45.7992,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:08:37.000Z"},{"lon":-116.6408,"lat":45.7981,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:08:31.000Z"},{"lon":-116.6408,"lat":45.7981,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:08:31.000Z"},{"lon":-116.6408,"lat":45.7981,"speedMph":582,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:08:31.000Z"},{"lon":-116.8456,"lat":45.7922,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:07:35.000Z"},{"lon":-116.8456,"lat":45.7922,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:07:35.000Z"},{"lon":-116.8456,"lat":45.7922,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:07:35.000Z"},{"lon":-116.8806,"lat":45.7897,"speedMph":581,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:07:30.000Z"},{"lon":-116.8806,"lat":45.7897,"speedMph":581,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:07:30.000Z"},{"lon":-116.8806,"lat":45.7897,"speedMph":581,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:07:30.000Z"},{"lon":-117.0458,"lat":45.7844,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:06:33.000Z"},{"lon":-117.0458,"lat":45.7844,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:06:33.000Z"},{"lon":-117.0458,"lat":45.7844,"speedMph":580,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:06:33.000Z"},{"lon":-117.0836,"lat":45.7833,"speedMph":579,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:06:28.000Z"},{"lon":-117.0836,"lat":45.7833,"speedMph":579,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:06:28.000Z"},{"lon":-117.0836,"lat":45.7833,"speedMph":579,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:06:28.000Z"},{"lon":-117.2469,"lat":45.7772,"speedMph":578,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:05:30.000Z"},{"lon":-117.2469,"lat":45.7772,"speedMph":578,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:05:30.000Z"},{"lon":-117.2469,"lat":45.7772,"speedMph":578,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:05:30.000Z"},{"lon":-117.2833,"lat":45.7758,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:05:27.000Z"},{"lon":-117.2833,"lat":45.7758,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:05:27.000Z"},{"lon":-117.2833,"lat":45.7758,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:05:27.000Z"},{"lon":-117.4486,"lat":45.7692,"speedMph":578,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:04:28.000Z"},{"lon":-117.4486,"lat":45.7692,"speedMph":578,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:04:28.000Z"},{"lon":-117.4486,"lat":45.7692,"speedMph":578,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:04:28.000Z"},{"lon":-117.4833,"lat":45.7681,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:04:26.000Z"},{"lon":-117.4833,"lat":45.7681,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:04:26.000Z"},{"lon":-117.4833,"lat":45.7681,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:04:26.000Z"},{"lon":-117.6875,"lat":45.76,"speedMph":578,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:03:26.000Z"},{"lon":-117.6875,"lat":45.76,"speedMph":578,"altitudeFt":35000,"source":"ASDI","date":"2014-06-30T19:03:26.000Z"},{"lon":-117.6822,"lat":45.7603,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:03:24.000Z"},{"lon":-117.6822,"lat":45.7603,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:03:24.000Z"},{"lon":-117.88,"lat":45.7508,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:02:24.000Z"},{"lon":-117.88,"lat":45.7508,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:02:24.000Z"},{"lon":-117.8814,"lat":45.7508,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:02:23.000Z"},{"lon":-117.8814,"lat":45.7508,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:02:23.000Z"},{"lon":-117.8814,"lat":45.7508,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:02:23.000Z"},{"lon":-118.0783,"lat":45.7417,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:01:22.000Z"},{"lon":-118.0789,"lat":45.7417,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:01:22.000Z"},{"lon":-118.0783,"lat":45.7417,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:01:22.000Z"},{"lon":-118.0789,"lat":45.7417,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:01:22.000Z"},{"lon":-118.0783,"lat":45.7417,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:01:22.000Z"},{"lon":-118.0789,"lat":45.7417,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:01:22.000Z"},{"lon":-118.2761,"lat":45.7328,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:00:20.000Z"},{"lon":-118.2769,"lat":45.7331,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:00:20.000Z"},{"lon":-118.2761,"lat":45.7328,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:00:20.000Z"},{"lon":-118.2769,"lat":45.7331,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:00:20.000Z"},{"lon":-118.2761,"lat":45.7328,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:00:20.000Z"},{"lon":-118.2769,"lat":45.7331,"speedMph":576,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T19:00:20.000Z"},{"lon":-118.5144,"lat":45.7219,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T18:59:19.000Z"},{"lon":-118.5144,"lat":45.7219,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T18:59:19.000Z"},{"lon":-118.5144,"lat":45.7219,"speedMph":578,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T18:59:19.000Z"},{"lon":-118.5131,"lat":45.7219,"speedMph":580,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T18:59:18.000Z"},{"lon":-118.5131,"lat":45.7219,"speedMph":580,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T18:59:18.000Z"},{"lon":-118.5131,"lat":45.7219,"speedMph":580,"altitudeFt":34900,"source":"ASDI","date":"2014-06-30T18:59:18.000Z"},{"lon":-118.7108,"lat":45.7111,"speedMph":580,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T18:58:18.000Z"},{"lon":-118.7108,"lat":45.7111,"speedMph":580,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T18:58:18.000Z"},{"lon":-118.7108,"lat":45.7111,"speedMph":580,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T18:58:18.000Z"},{"lon":-118.7108,"lat":45.7111,"speedMph":580,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T18:58:18.000Z"},{"lon":-118.7094,"lat":45.7108,"speedMph":585,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T18:58:16.000Z"},{"lon":-118.7094,"lat":45.7108,"speedMph":585,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T18:58:16.000Z"},{"lon":-118.7094,"lat":45.7108,"speedMph":585,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T18:58:16.000Z"},{"lon":-118.7094,"lat":45.7108,"speedMph":585,"altitudeFt":34800,"source":"ASDI","date":"2014-06-30T18:58:16.000Z"},{"lon":-118.9092,"lat":45.7003,"speedMph":585,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:16.000Z"},{"lon":-118.9092,"lat":45.7003,"speedMph":585,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:16.000Z"},{"lon":-118.9092,"lat":45.7003,"speedMph":585,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:16.000Z"},{"lon":-118.9092,"lat":45.7003,"speedMph":585,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:16.000Z"},{"lon":-118.9092,"lat":45.7003,"speedMph":585,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:16.000Z"},{"lon":-118.9081,"lat":45.7,"speedMph":587,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:15.000Z"},{"lon":-118.9081,"lat":45.7,"speedMph":587,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:15.000Z"},{"lon":-118.9081,"lat":45.7,"speedMph":587,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:15.000Z"},{"lon":-118.9081,"lat":45.7,"speedMph":587,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:15.000Z"},{"lon":-118.9081,"lat":45.7,"speedMph":587,"altitudeFt":34200,"source":"ASDI","date":"2014-06-30T18:57:15.000Z"},{"lon":-119.1094,"lat":45.7042,"speedMph":586,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:15.000Z"},{"lon":-119.1094,"lat":45.7042,"speedMph":586,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:15.000Z"},{"lon":-119.1094,"lat":45.7042,"speedMph":586,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:15.000Z"},{"lon":-119.1094,"lat":45.7042,"speedMph":586,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:15.000Z"},{"lon":-119.1086,"lat":45.7039,"speedMph":588,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:12.000Z"},{"lon":-119.1086,"lat":45.7039,"speedMph":588,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:12.000Z"},{"lon":-119.1086,"lat":45.7039,"speedMph":588,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:12.000Z"},{"lon":-119.1086,"lat":45.7039,"speedMph":588,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:12.000Z"},{"lon":-119.1086,"lat":45.7039,"speedMph":588,"altitudeFt":33400,"source":"ASDI","date":"2014-06-30T18:56:12.000Z"},{"lon":-119.3114,"lat":45.7103,"speedMph":583,"altitudeFt":32500,"source":"ASDI","date":"2014-06-30T18:55:14.000Z"},{"lon":-119.3114,"lat":45.7103,"speedMph":583,"altitudeFt":32500,"source":"ASDI","date":"2014-06-30T18:55:14.000Z"},{"lon":-119.3114,"lat":45.7103,"speedMph":583,"altitudeFt":32500,"source":"ASDI","date":"2014-06-30T18:55:14.000Z"},{"lon":-119.3114,"lat":45.7103,"speedMph":583,"altitudeFt":32500,"source":"ASDI","date":"2014-06-30T18:55:14.000Z"},{"lon":-119.3103,"lat":45.71,"speedMph":588,"altitudeFt":32500,"source":"ASDI","date":"2014-06-30T18:55:10.000Z"},{"lon":-119.3103,"lat":45.71,"speedMph":588,"altitudeFt":32500,"source":"ASDI","date":"2014-06-30T18:55:10.000Z"},{"lon":-119.3103,"lat":45.71,"speedMph":588,"altitudeFt":32500,"source":"ASDI","date":"2014-06-30T18:55:10.000Z"},{"lon":-119.5128,"lat":45.7142,"speedMph":583,"altitudeFt":31700,"source":"ASDI","date":"2014-06-30T18:54:12.000Z"},{"lon":-119.5128,"lat":45.7142,"speedMph":583,"altitudeFt":31700,"source":"ASDI","date":"2014-06-30T18:54:12.000Z"},{"lon":-119.5128,"lat":45.7142,"speedMph":583,"altitudeFt":31700,"source":"ASDI","date":"2014-06-30T18:54:12.000Z"},{"lon":-119.5511,"lat":45.7153,"speedMph":590,"altitudeFt":31400,"source":"ASDI","date":"2014-06-30T18:54:08.000Z"},{"lon":-119.5511,"lat":45.7153,"speedMph":590,"altitudeFt":31400,"source":"ASDI","date":"2014-06-30T18:54:08.000Z"},{"lon":-119.5511,"lat":45.7153,"speedMph":590,"altitudeFt":31400,"source":"ASDI","date":"2014-06-30T18:54:08.000Z"},{"lon":-119.7111,"lat":45.7183,"speedMph":593,"altitudeFt":30600,"source":"ASDI","date":"2014-06-30T18:53:11.000Z"},{"lon":-119.7111,"lat":45.7183,"speedMph":593,"altitudeFt":30600,"source":"ASDI","date":"2014-06-30T18:53:11.000Z"},{"lon":-119.7111,"lat":45.7183,"speedMph":593,"altitudeFt":30600,"source":"ASDI","date":"2014-06-30T18:53:11.000Z"},{"lon":-119.7111,"lat":45.7183,"speedMph":593,"altitudeFt":30600,"source":"ASDI","date":"2014-06-30T18:53:11.000Z"},{"lon":-119.7539,"lat":45.7208,"speedMph":590,"altitudeFt":30300,"source":"ASDI","date":"2014-06-30T18:53:06.000Z"},{"lon":-119.7539,"lat":45.7208,"speedMph":590,"altitudeFt":30300,"source":"ASDI","date":"2014-06-30T18:53:06.000Z"},{"lon":-119.7539,"lat":45.7208,"speedMph":590,"altitudeFt":30300,"source":"ASDI","date":"2014-06-30T18:53:06.000Z"},{"lon":-119.7539,"lat":45.7208,"speedMph":590,"altitudeFt":30300,"source":"ASDI","date":"2014-06-30T18:53:06.000Z"},{"lon":-119.9147,"lat":45.7219,"speedMph":591,"altitudeFt":29400,"source":"ASDI","date":"2014-06-30T18:52:10.000Z"},{"lon":-119.9147,"lat":45.7219,"speedMph":591,"altitudeFt":29400,"source":"ASDI","date":"2014-06-30T18:52:10.000Z"},{"lon":-119.9147,"lat":45.7219,"speedMph":591,"altitudeFt":29400,"source":"ASDI","date":"2014-06-30T18:52:10.000Z"},{"lon":-119.9147,"lat":45.7219,"speedMph":591,"altitudeFt":29400,"source":"ASDI","date":"2014-06-30T18:52:10.000Z"},{"lon":-119.9575,"lat":45.7253,"speedMph":589,"altitudeFt":29200,"source":"ASDI","date":"2014-06-30T18:52:04.000Z"},{"lon":-119.9575,"lat":45.7253,"speedMph":589,"altitudeFt":29200,"source":"ASDI","date":"2014-06-30T18:52:04.000Z"},{"lon":-119.9575,"lat":45.7253,"speedMph":589,"altitudeFt":29200,"source":"ASDI","date":"2014-06-30T18:52:04.000Z"},{"lon":-119.9575,"lat":45.7253,"speedMph":589,"altitudeFt":29200,"source":"ASDI","date":"2014-06-30T18:52:04.000Z"},{"lon":-120.1197,"lat":45.7272,"speedMph":582,"altitudeFt":28400,"source":"ASDI","date":"2014-06-30T18:51:08.000Z"},{"lon":-120.1197,"lat":45.7272,"speedMph":582,"altitudeFt":28400,"source":"ASDI","date":"2014-06-30T18:51:08.000Z"},{"lon":-120.1197,"lat":45.7272,"speedMph":582,"altitudeFt":28400,"source":"ASDI","date":"2014-06-30T18:51:08.000Z"},{"lon":-120.1197,"lat":45.7272,"speedMph":582,"altitudeFt":28400,"source":"ASDI","date":"2014-06-30T18:51:08.000Z"},{"lon":-120.1622,"lat":45.7286,"speedMph":580,"altitudeFt":28100,"source":"ASDI","date":"2014-06-30T18:51:02.000Z"},{"lon":-120.1622,"lat":45.7286,"speedMph":580,"altitudeFt":28100,"source":"ASDI","date":"2014-06-30T18:51:02.000Z"},{"lon":-120.1622,"lat":45.7286,"speedMph":580,"altitudeFt":28100,"source":"ASDI","date":"2014-06-30T18:51:02.000Z"},{"lon":-120.1622,"lat":45.7286,"speedMph":580,"altitudeFt":28100,"source":"ASDI","date":"2014-06-30T18:51:02.000Z"},{"lon":-120.3614,"lat":45.7311,"speedMph":573,"altitudeFt":27300,"source":"ASDI","date":"2014-06-30T18:50:07.000Z"},{"lon":-120.3614,"lat":45.7311,"speedMph":573,"altitudeFt":27300,"source":"ASDI","date":"2014-06-30T18:50:07.000Z"},{"lon":-120.3614,"lat":45.7311,"speedMph":573,"altitudeFt":27300,"source":"ASDI","date":"2014-06-30T18:50:07.000Z"},{"lon":-120.3614,"lat":45.7311,"speedMph":573,"altitudeFt":27300,"source":"ASDI","date":"2014-06-30T18:50:07.000Z"},{"lon":-120.3642,"lat":45.7322,"speedMph":565,"altitudeFt":27300,"source":"ASDI","date":"2014-06-30T18:49:59.000Z"},{"lon":-120.3642,"lat":45.7322,"speedMph":565,"altitudeFt":27300,"source":"ASDI","date":"2014-06-30T18:49:59.000Z"},{"lon":-120.3642,"lat":45.7322,"speedMph":565,"altitudeFt":27300,"source":"ASDI","date":"2014-06-30T18:49:59.000Z"},{"lon":-120.3642,"lat":45.7322,"speedMph":565,"altitudeFt":27300,"source":"ASDI","date":"2014-06-30T18:49:59.000Z"},{"lon":-120.5656,"lat":45.7356,"speedMph":563,"altitudeFt":26300,"source":"ASDI","date":"2014-06-30T18:49:05.000Z"},{"lon":-120.5656,"lat":45.7356,"speedMph":563,"altitudeFt":26300,"source":"ASDI","date":"2014-06-30T18:49:05.000Z"},{"lon":-120.5656,"lat":45.7356,"speedMph":563,"altitudeFt":26300,"source":"ASDI","date":"2014-06-30T18:49:05.000Z"},{"lon":-120.5656,"lat":45.7356,"speedMph":563,"altitudeFt":26300,"source":"ASDI","date":"2014-06-30T18:49:05.000Z"},{"lon":-120.5636,"lat":45.7372,"speedMph":552,"altitudeFt":26300,"source":"ASDI","date":"2014-06-30T18:48:57.000Z"},{"lon":-120.5636,"lat":45.7372,"speedMph":552,"altitudeFt":26300,"source":"ASDI","date":"2014-06-30T18:48:57.000Z"},{"lon":-120.5636,"lat":45.7372,"speedMph":552,"altitudeFt":26300,"source":"ASDI","date":"2014-06-30T18:48:57.000Z"},{"lon":-120.5636,"lat":45.7372,"speedMph":552,"altitudeFt":26300,"source":"ASDI","date":"2014-06-30T18:48:57.000Z"},{"lon":-120.7603,"lat":45.7378,"speedMph":557,"altitudeFt":25300,"source":"ASDI","date":"2014-06-30T18:48:04.000Z"},{"lon":-120.7603,"lat":45.7378,"speedMph":557,"altitudeFt":25300,"source":"ASDI","date":"2014-06-30T18:48:04.000Z"},{"lon":-120.7603,"lat":45.7378,"speedMph":557,"altitudeFt":25300,"source":"ASDI","date":"2014-06-30T18:48:04.000Z"},{"lon":-120.7603,"lat":45.7378,"speedMph":557,"altitudeFt":25300,"source":"ASDI","date":"2014-06-30T18:48:04.000Z"},{"lon":-120.7603,"lat":45.7378,"speedMph":557,"altitudeFt":25300,"source":"ASDI","date":"2014-06-30T18:48:04.000Z"},{"lon":-120.7958,"lat":45.7383,"speedMph":542,"altitudeFt":25000,"source":"ASDI","date":"2014-06-30T18:47:55.000Z"},{"lon":-120.7958,"lat":45.7383,"speedMph":542,"altitudeFt":25000,"source":"ASDI","date":"2014-06-30T18:47:55.000Z"},{"lon":-120.7958,"lat":45.7383,"speedMph":542,"altitudeFt":25000,"source":"ASDI","date":"2014-06-30T18:47:55.000Z"},{"lon":-120.7958,"lat":45.7383,"speedMph":542,"altitudeFt":25000,"source":"ASDI","date":"2014-06-30T18:47:55.000Z"},{"lon":-120.7958,"lat":45.7383,"speedMph":542,"altitudeFt":25000,"source":"ASDI","date":"2014-06-30T18:47:55.000Z"},{"lon":-120.9547,"lat":45.7406,"speedMph":539,"altitudeFt":24100,"source":"ASDI","date":"2014-06-30T18:47:03.000Z"},{"lon":-120.9547,"lat":45.7406,"speedMph":539,"altitudeFt":24100,"source":"ASDI","date":"2014-06-30T18:47:03.000Z"},{"lon":-120.9547,"lat":45.7406,"speedMph":539,"altitudeFt":24100,"source":"ASDI","date":"2014-06-30T18:47:03.000Z"},{"lon":-120.9547,"lat":45.7406,"speedMph":539,"altitudeFt":24100,"source":"ASDI","date":"2014-06-30T18:47:03.000Z"},{"lon":-120.9889,"lat":45.7408,"speedMph":531,"altitudeFt":23800,"source":"ASDI","date":"2014-06-30T18:46:53.000Z"},{"lon":-120.9889,"lat":45.7408,"speedMph":531,"altitudeFt":23800,"source":"ASDI","date":"2014-06-30T18:46:53.000Z"},{"lon":-120.9889,"lat":45.7408,"speedMph":531,"altitudeFt":23800,"source":"ASDI","date":"2014-06-30T18:46:53.000Z"},{"lon":-120.9889,"lat":45.7408,"speedMph":531,"altitudeFt":23800,"source":"ASDI","date":"2014-06-30T18:46:53.000Z"},{"lon":-121.1431,"lat":45.7425,"speedMph":535,"altitudeFt":22800,"source":"ASDI","date":"2014-06-30T18:46:01.000Z"},{"lon":-121.1431,"lat":45.7425,"speedMph":535,"altitudeFt":22800,"source":"ASDI","date":"2014-06-30T18:46:01.000Z"},{"lon":-121.1431,"lat":45.7425,"speedMph":535,"altitudeFt":22800,"source":"ASDI","date":"2014-06-30T18:46:01.000Z"},{"lon":-121.1431,"lat":45.7425,"speedMph":535,"altitudeFt":22800,"source":"ASDI","date":"2014-06-30T18:46:01.000Z"},{"lon":-121.1431,"lat":45.7425,"speedMph":535,"altitudeFt":22800,"source":"ASDI","date":"2014-06-30T18:46:01.000Z"},{"lon":-121.1769,"lat":45.7436,"speedMph":519,"altitudeFt":22500,"source":"ASDI","date":"2014-06-30T18:45:51.000Z"},{"lon":-121.1769,"lat":45.7436,"speedMph":519,"altitudeFt":22500,"source":"ASDI","date":"2014-06-30T18:45:51.000Z"},{"lon":-121.1769,"lat":45.7436,"speedMph":519,"altitudeFt":22500,"source":"ASDI","date":"2014-06-30T18:45:51.000Z"},{"lon":-121.1769,"lat":45.7436,"speedMph":519,"altitudeFt":22500,"source":"ASDI","date":"2014-06-30T18:45:51.000Z"},{"lon":-121.1769,"lat":45.7436,"speedMph":519,"altitudeFt":22500,"source":"ASDI","date":"2014-06-30T18:45:51.000Z"},{"lon":-121.3286,"lat":45.7428,"speedMph":518,"altitudeFt":21400,"source":"ASDI","date":"2014-06-30T18:45:00.000Z"},{"lon":-121.3286,"lat":45.7428,"speedMph":518,"altitudeFt":21400,"source":"ASDI","date":"2014-06-30T18:45:00.000Z"},{"lon":-121.3286,"lat":45.7428,"speedMph":518,"altitudeFt":21400,"source":"ASDI","date":"2014-06-30T18:45:00.000Z"},{"lon":-121.3286,"lat":45.7428,"speedMph":518,"altitudeFt":21400,"source":"ASDI","date":"2014-06-30T18:45:00.000Z"},{"lon":-121.3286,"lat":45.7428,"speedMph":518,"altitudeFt":21400,"source":"ASDI","date":"2014-06-30T18:45:00.000Z"},{"lon":-121.5089,"lat":45.745,"speedMph":509,"altitudeFt":20000,"source":"ASDI","date":"2014-06-30T18:43:58.000Z"},{"lon":-121.5089,"lat":45.745,"speedMph":509,"altitudeFt":20000,"source":"ASDI","date":"2014-06-30T18:43:58.000Z"},{"lon":-121.5089,"lat":45.745,"speedMph":509,"altitudeFt":20000,"source":"ASDI","date":"2014-06-30T18:43:58.000Z"},{"lon":-121.5089,"lat":45.745,"speedMph":509,"altitudeFt":20000,"source":"ASDI","date":"2014-06-30T18:43:58.000Z"},{"lon":-121.5089,"lat":45.745,"speedMph":509,"altitudeFt":20000,"source":"ASDI","date":"2014-06-30T18:43:58.000Z"},{"lon":-121.6864,"lat":45.7456,"speedMph":489,"altitudeFt":18400,"source":"ASDI","date":"2014-06-30T18:42:57.000Z"},{"lon":-121.6864,"lat":45.7456,"speedMph":489,"altitudeFt":18400,"source":"ASDI","date":"2014-06-30T18:42:57.000Z"},{"lon":-121.6864,"lat":45.7456,"speedMph":489,"altitudeFt":18400,"source":"ASDI","date":"2014-06-30T18:42:57.000Z"},{"lon":-121.6864,"lat":45.7456,"speedMph":489,"altitudeFt":18400,"source":"ASDI","date":"2014-06-30T18:42:57.000Z"},{"lon":-121.6864,"lat":45.7456,"speedMph":489,"altitudeFt":18400,"source":"ASDI","date":"2014-06-30T18:42:57.000Z"},{"lon":-121.8494,"lat":45.7481,"speedMph":481,"altitudeFt":17300,"source":"ASDI","date":"2014-06-30T18:41:56.000Z"},{"lon":-121.8494,"lat":45.7481,"speedMph":481,"altitudeFt":17300,"source":"ASDI","date":"2014-06-30T18:41:56.000Z"},{"lon":-121.8494,"lat":45.7481,"speedMph":481,"altitudeFt":17300,"source":"ASDI","date":"2014-06-30T18:41:56.000Z"},{"lon":-122.0275,"lat":45.7511,"speedMph":474,"altitudeFt":16000,"source":"ASDI","date":"2014-06-30T18:40:54.000Z"},{"lon":-122.0275,"lat":45.7511,"speedMph":474,"altitudeFt":16000,"source":"ASDI","date":"2014-06-30T18:40:54.000Z"},{"lon":-122.0275,"lat":45.7511,"speedMph":474,"altitudeFt":16000,"source":"ASDI","date":"2014-06-30T18:40:54.000Z"},{"lon":-122.0275,"lat":45.7511,"speedMph":474,"altitudeFt":16000,"source":"ASDI","date":"2014-06-30T18:40:54.000Z"},{"lon":-122.1931,"lat":45.7525,"speedMph":453,"altitudeFt":15700,"source":"ASDI","date":"2014-06-30T18:39:53.000Z"},{"lon":-122.1931,"lat":45.7525,"speedMph":453,"altitudeFt":15700,"source":"ASDI","date":"2014-06-30T18:39:53.000Z"},{"lon":-122.1931,"lat":45.7525,"speedMph":453,"altitudeFt":15700,"source":"ASDI","date":"2014-06-30T18:39:53.000Z"},{"lon":-122.1931,"lat":45.7525,"speedMph":453,"altitudeFt":15700,"source":"ASDI","date":"2014-06-30T18:39:53.000Z"},{"lon":-122.3517,"lat":45.7539,"speedMph":428,"source":"ASDI","date":"2014-06-30T18:38:51.000Z"},{"lon":-122.3517,"lat":45.7539,"speedMph":428,"source":"ASDI","date":"2014-06-30T18:38:51.000Z"},{"lon":-122.3517,"lat":45.7539,"speedMph":428,"source":"ASDI","date":"2014-06-30T18:38:51.000Z"},{"lon":-122.3517,"lat":45.7539,"speedMph":428,"source":"ASDI","date":"2014-06-30T18:38:51.000Z"},{"lon":-122.5133,"lat":45.7556,"speedMph":395,"source":"ASDI","date":"2014-06-30T18:37:50.000Z"},{"lon":-122.5133,"lat":45.7556,"speedMph":395,"source":"ASDI","date":"2014-06-30T18:37:50.000Z"},{"lon":-122.5133,"lat":45.7556,"speedMph":395,"source":"ASDI","date":"2014-06-30T18:37:50.000Z"},{"lon":-122.5133,"lat":45.7556,"speedMph":395,"source":"ASDI","date":"2014-06-30T18:37:50.000Z"},{"lon":-122.6497,"lat":45.7589,"speedMph":329,"source":"ASDI","date":"2014-06-30T18:36:49.000Z"},{"lon":-122.6497,"lat":45.7589,"speedMph":329,"source":"ASDI","date":"2014-06-30T18:36:49.000Z"},{"lon":-122.6497,"lat":45.7589,"speedMph":329,"source":"ASDI","date":"2014-06-30T18:36:49.000Z"},{"lon":-122.6497,"lat":45.7589,"speedMph":329,"source":"ASDI","date":"2014-06-30T18:36:49.000Z"},{"lon":-122.7564,"lat":45.7425,"speedMph":319,"altitudeFt":8400,"source":"ASDI","date":"2014-06-30T18:35:47.000Z"},{"lon":-122.7564,"lat":45.7425,"speedMph":319,"altitudeFt":8400,"source":"ASDI","date":"2014-06-30T18:35:47.000Z"},{"lon":-122.7564,"lat":45.7425,"speedMph":319,"altitudeFt":8400,"source":"ASDI","date":"2014-06-30T18:35:47.000Z"},{"lon":-122.7564,"lat":45.7425,"speedMph":319,"altitudeFt":8400,"source":"ASDI","date":"2014-06-30T18:35:47.000Z"},{"lon":-122.7864,"lat":45.7078,"speedMph":327,"altitudeFt":6900,"source":"ASDI","date":"2014-06-30T18:35:14.000Z"},{"lon":-122.7864,"lat":45.7078,"speedMph":327,"altitudeFt":6900,"source":"ASDI","date":"2014-06-30T18:35:14.000Z"},{"lon":-122.7864,"lat":45.7078,"speedMph":327,"altitudeFt":6900,"source":"ASDI","date":"2014-06-30T18:35:14.000Z"},{"lon":-122.7836,"lat":45.6722,"speedMph":307,"altitudeFt":5600,"source":"ASDI","date":"2014-06-30T18:34:46.000Z"},{"lon":-122.7439,"lat":45.645,"speedMph":326,"altitudeFt":3700,"source":"ASDI","date":"2014-06-30T18:34:13.000Z"},{"lon":-122.7439,"lat":45.645,"speedMph":326,"altitudeFt":3700,"source":"ASDI","date":"2014-06-30T18:34:13.000Z"},{"lon":-122.6919,"lat":45.6253,"speedMph":238,"altitudeFt":2400,"source":"ASDI","date":"2014-06-30T18:33:45.000Z"},{"lon":-122.6919,"lat":45.6253,"speedMph":238,"altitudeFt":2400,"source":"ASDI","date":"2014-06-30T18:33:45.000Z"},{"lon":-122.6467,"lat":45.6106,"speedMph":192,"altitudeFt":1900,"source":"ASDI","date":"2014-06-30T18:33:12.000Z"},{"lon":-122.6467,"lat":45.6106,"speedMph":192,"altitudeFt":1900,"source":"ASDI","date":"2014-06-30T18:33:12.000Z"},{"lon":-122.6114,"lat":45.5989,"speedMph":181,"source":"ASDI","date":"2014-06-30T18:32:35.000Z"}],"waypoints":[{"lon":-122.5833,"lat":45.5833},{"lon":-122.4667,"lat":45.5667},{"lon":-122.4333,"lat":45.55},{"lon":-122.4,"lat":45.55},{"lon":-122.3333,"lat":45.5333},{"lon":-122.3167,"lat":45.5333},{"lon":-122.2667,"lat":45.5667},{"lon":-122.25,"lat":45.5833},{"lon":-122.15,"lat":45.6333},{"lon":-122.0667,"lat":45.6667},{"lon":-121.85,"lat":45.7333},{"lon":-121.85,"lat":45.7333},{"lon":-121.85,"lat":45.7333},{"lon":-121.5667,"lat":45.7333},{"lon":-121.3,"lat":45.7333},{"lon":-121.0,"lat":45.7333},{"lon":-120.7333,"lat":45.7333},{"lon":-120.6,"lat":45.7333},{"lon":-120.5833,"lat":45.7333},{"lon":-120.1667,"lat":45.7167},{"lon":-120.0,"lat":45.7167},{"lon":-119.6667,"lat":45.7167},{"lon":-119.4667,"lat":45.7},{"lon":-119.3167,"lat":45.7},{"lon":-118.9667,"lat":45.6833},{"lon":-118.9333,"lat":45.6833},{"lon":-117.8667,"lat":45.75},{"lon":-117.7333,"lat":45.75},{"lon":-117.5,"lat":45.75},{"lon":-115.1667,"lat":45.8333},{"lon":-115.0,"lat":45.8333},{"lon":-114.7667,"lat":45.8333},{"lon":-112.8667,"lat":45.85},{"lon":-112.1667,"lat":45.85},{"lon":-110.9833,"lat":45.65},{"lon":-110.0,"lat":45.7167},{"lon":-108.6167,"lat":45.8},{"lon":-106.9667,"lat":45.6667},{"lon":-106.0,"lat":45.5667},{"lon":-104.6333,"lat":45.4333},{"lon":-103.1667,"lat":45.2667},{"lon":-101.7,"lat":45.0667},{"lon":-97.7333,"lat":44.75},{"lon":-96.55,"lat":44.6333},{"lon":-95.6667,"lat":44.5333},{"lon":-95.4,"lat":44.5},{"lon":-95.35,"lat":44.4833},{"lon":-95.2667,"lat":44.4833},{"lon":-95.1167,"lat":44.4667},{"lon":-94.9333,"lat":44.5},{"lon":-94.8667,"lat":44.5167},{"lon":-94.6,"lat":44.5833},{"lon":-94.3667,"lat":44.6333},{"lon":-94.3,"lat":44.65},{"lon":-94.15,"lat":44.6833},{"lon":-94.1167,"lat":44.6833},{"lon":-94.0667,"lat":44.7},{"lon":-93.9,"lat":44.7333},{"lon":-93.7167,"lat":44.7833},{"lon":-93.7167,"lat":44.7833},{"lon":-93.4833,"lat":44.8333},{"lon":-93.4333,"lat":44.85},{"lon":-93.3667,"lat":44.85},{"lon":-93.25,"lat":44.8667},{"lon":-93.2167,"lat":44.8667}],"legacyRoute":"KPDX.LAVAA5.PDT.J16.HIA.J151.BIL.J34.RWF.SKETR5.KMSP/2116"}};

	// done(null, res);

	jsonpRequest(flightPath, "callback", function(err, response) {
		done(err, response);
	});
};

Flex.prototype.fetchFlightsWithinBounds = function(bounds, options, done) {
	if (bounds.topLat == null || bounds.leftLon == null || bounds.bottomLat == null || bounds.rightLon == null) {
		throw new Error("required bounds property missing");
	}
	/* 
	Options:
	  - maxFlights
	  - extendedOptions
	See https://developer.flightstats.com/api-docs/flightstatus/v2/flightsNear for documentation
	*/

	var flightPath = [
	  this.fsBasePath,
	  'flightstatus/rest/v2/jsonp/flightsNear/',
	  bounds.topLat,
	  '/',
	  bounds.leftLon,
	  '/',
	  bounds.bottomLat,
	  '/',
	  bounds.rightLon,
	  '?appId=',
	  this.appId,
	  '&appKey=',
	  this.appKey
	];

	for (var option in options) {
		flightPath.push('&');
		flightPath.push(option);
		flightPath.push('=');
		flightPath.push(options[option]);
	}
	  	
	flightPath = flightPath.join('');

	jsonpRequest(flightPath, "callback", function(err, response) {
		done(err, response);
	});
};

Flex.prototype.fetchActiveAirports = function(options, done) {
	/* 
	Options:
	  - extendedOptions
	See https://developer.flightstats.com/api-docs/flightstatus/v2/flightsNear for documentation
	*/

	var airportPath = [
	  this.fsBasePath,
	  'airports/rest/v1/jsonp/active?appId=',
	  this.appId,
	  '&appKey=',
	  this.appKey
	];

	for (var option in options) {
		airportPath.push('&');
		airportPath.push(option);
		airportPath.push('=');
		airportPath.push(options[option]);
	}
	  	
	airportPath = airportPath.join('');

	jsonpRequest(airportPath, "callback", function(err, response) {
		done(err, response);
	});
};

Flex.prototype.fetchDelayIndexesByCountry = function(country, options, done) {
	if (country == null) {
		throw new Error("required country property missing");
	}
	/* 
	Options:
	  - classification
	  - score
	  - extendedOptions
	See https://developer.flightstats.com/api-docs/delayindex/v1 for documentation
	*/

	var path = [
	  this.fsBasePath,
	  'delayindex/rest/v1/jsonp/country/',
	  country,
	  '?appId=',
	  this.appId,
	  '&appKey=',
	  this.appKey
	];

	for (var option in options) {
		path.push('&');
		path.push(option);
		path.push('=');
		path.push(options[option]);
	}
	  	
	path = path.join('');

	jsonpRequest(path, "callback", function(err, response) {
		done(err, response);
	});
};

// jsonp client
(function(e){"use strict";var t=e.jsonpClient,n=typeof window!="undefined",r,i,s=/[\?|&]callback=([a-z0-9_]+)/i,o=function(){var e=Array.prototype.slice.apply(arguments),t,n=e.slice(0,-1),r=0,s,o=[],u,a;try{t=e.slice(-1)[0];if(typeof t!="function")throw new Error("Callback not found")}catch(f){throw new Error("jsonpClient expects a callback")}typeof n[0]!="string"&&(n=n[0]),a=function(){var e=0;o=o.sort(function(e,t){return e.position>t.position});for(e=0;o.length>e;e+=1)o[e]=o[e].data;o.unshift(null),t.apply(null,o)},u=function(e,u){i(n[r],function(e,r){if(s)return;s=e;if(e)return t(e);o.push({data:r,position:u}),o.length===n.length&&a()})};for(r=0;n.length>r;r+=1)u(n[r]+"",r)};o.noConflict=function(){return e.jsonpClient=t,o},r=function(){var e,t,n=document.getElementsByTagName("head")[0];return t=function(e,t){var r=document.createElement("script"),i=!1;r.src=e,r.async=!0,r.onload=r.onreadystatechange=function(){!i&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")&&(i=!0,r.onload=r.onreadystatechange=null,r&&r.parentNode&&r.parentNode.removeChild(r),t())},n.appendChild(r)},e=function(e,t){var n=e.match(s);if(!n)return t(new Error("Could not find callback on URL"));t(null,n[1])},function(n,r){e(n,function(e,i){var s,o=window[i];if(e)return r(e);window[i]=function(e){s=e},t(n,function(e){!e&&!s&&(e=new Error("Calling to "+i+" did not returned a JSON response."+"Make sure the callback "+i+" exists and is properly formatted."));if(o)window[i]=o;else try{delete window[i]}catch(t){window[i]=undefined}r(e,s)})})}},i=n?r():require("./jsonp-node.js"),typeof module!="undefined"&&module.exports?module.exports=o:e.jsonpClient=o})(this);

function jsonpRequest(url, callback, done) {
	url = url + ("&callback=cb" + Math.random()).replace('.', '');
	jsonpClient(url, function (err, data) {
		done(err, data);
	});
	// $.ajax({
	//   url: url,
	//   jsonp: callback,
	//   dataType: "jsonp",
	//   beforeSend: function(a,b,c) {
	//     // console.log("beforeSend", a, b, c);
	//   },
	//   success: function(response) {
	//     // console.log("success", response);
	//     done(response.error, response);
	//   },
	//   error: function(xhr, ajaxOptions, err) {
	//     console.log("error", err);
	//     done(err);
	//   },
	//   complete: function(response) {
	//     // console.log("complete", response);
	//     // done(response);
	//   }
	// });
}
'use strict';
// pass the map separately
var Flight = function(flightId, config, map) {
  var self = this;
  this.flex = new Flex(config.flexConfig);
  this.flightId = flightId;
  this.map = map;
  this.planeIcon = config.icon || 'M11.544,23.594c0.3-0.008,0.498,0.041,0.509,0.316s0.447,0.236,0.447,0.236s0.437,0.039,0.447-0.236 c0.012-0.275,0.209-0.324,0.509-0.316c0.233,0.004,1.563,0.521,2.243,0.641c0.668,0.119,1.425-0.398-0.043-1.387 c-0.555-0.373-1.594-1.127-1.807-1.355c-0.143-0.154-0.129-3.689-0.142-4.832s0-2.453,0-2.453s0.052-0.588,0.122-0.594 c0.071-0.008,7.27,2.914,8.619,3.617c1.35,0.705,2.569,1.334,2.566,0.367c0,0,0.214-1.195-3.145-3.332 c-3.358-2.138-3.764-2.522-3.764-2.522l-0.464-0.328c0.001-0.019,0.006-0.036,0.006-0.055V10.25c0-0.441-0.357-0.798-0.799-0.798 s-0.799,0.357-0.799,0.798v0.042l-2.066-1.458c0,0-0.101-0.363-0.112-0.556c-0.014-0.194,0.06-3.191-0.026-4.249 c-0.071-0.884-0.524-3.28-1.346-3.28l0,0l0,0c-0.821,0-1.274,2.396-1.346,3.28c-0.086,1.058-0.013,4.055-0.026,4.249 c-0.013,0.193-0.113,0.556-0.113,0.556l-2.066,1.458V10.25c0-0.441-0.357-0.798-0.798-0.798c-0.44,0-0.799,0.357-0.799,0.798v1.111 c0,0.019,0.004,0.036,0.005,0.055l-0.464,0.328c0,0-0.404,0.384-3.762,2.522c-3.358,2.137-3.146,3.332-3.146,3.332 c-0.002,0.967,1.217,0.338,2.567-0.367c1.35-0.703,8.547-3.625,8.619-3.617c0.071,0.006,0.123,0.594,0.123,0.594 s0.013,1.311,0,2.453s0.001,4.678-0.142,4.832c-0.213,0.229-1.251,0.982-1.807,1.355c-1.467,0.988-0.711,1.506-0.043,1.387 C9.982,24.115,11.312,23.598,11.544,23.594z';
  this.planeIconUrl = config.planeIconUrl;
  setConfig('planeIconSize', config.planeIconSize, 26);
  setConfig('planeIconScale', config.planeIconScale, 1);
  this.planeIconRotation = config.planeIconRotation || 0;
  this.planeIconColor = config.planeIconColor || '#FFFFFF';
  setConfig('planeIconOpacity', config.planeIconOpacity, 1);
  setConfig('initialAnimationPathPointCount', config.initialAnimationPathPointCount, 15);
  this.fsBasePath = config.fsBasePath || '/data/';
  this.pollingRate = config.pollingRate || 60000;
  this.color = config.color || '#FFFFFF';
  this.drawPlanFlag = config.drawPlan || false;
  this.planColor = config.planColor || '#FFFFFF';
  setConfig('planWidth', config.planWidth, 2);
  setConfig('planOpacity', config.planOpacity, 1);
  this.drawArcFlag = config.drawArc || false;
  this.arcColor = config.arcColor || '#FFFFFF';
  setConfig('arcWidth', config.arcWidth, 2);
  setConfig('arcOpacity', config.arcOpacity, 1);
  this.pathColor = config.pathColor || '#FFFFFF';
  setConfig('pathWidth', config.pathWidth, 2);
  setConfig('pathOpacity', config.pathOpacity, 1);
  setConfig('pathPointRadius', config.pathPointRadius, 1);

  this.data = {};
  this.transitions = {};
  this.positions = [];
  this.interpolatedPositions = [];
  this.travelledPositions = [];
  this.untravelledPositions = [];
  this.waypoints = [];
  this.points = [];
  this.stillInterior = true;

  if (this.planeIconUrl != null && this.planeIconUrl.length > 0) {
    this.plane = map.planes.append('svg:image')
      .attr('xlink:href', this.planeIconUrl)
      .attr('height', this.planeIconSize + 'px')
      .attr('width', this.planeIconSize + 'px')
      .attr('transform', 'scale(' + this.planeIconScale + ')');
  }
  else if (this.planeIcon != null && this.planeIcon.length > 0) {
    this.plane = map.planes.append('path')
      .attr('stroke', this.planeIconColor)
      .attr('stroke-width', 1)
      .attr('fill', this.planeIconColor)
      .attr('fill-opacity', this.planeIconOpacity)
      .attr('stroke-opacity', this.planeIconOpacity)
      .attr('transform-origin', '50% 50%')
      .attr('d', this.planeIcon);
  }
  else {
    throw new Error('Missing planeIcon or planeIconUrl');
  }

  this.path = map.paths.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'none');

  this.plan = map.plans.append('path')
    .attr('fill', 'none')
    .attr('stroke', this.planColor)
    .attr('stroke-width', this.planWidth)
    .attr('stroke-opacity', this.planOpacity);

  this.arc = map.arcs.append('path')
    .attr('fill', 'none')
    .attr('stroke', this.arcColor)
    .attr('stroke-width', this.arcWidth)
    .attr('stroke-opacity', this.arcOpacity);

  function setConfig(property, configValue, defaultValue) {
    if (configValue != null) {
      self[property] = configValue;
    }
    else {
      self[property] = defaultValue;
    }
  }
};

Flight.prototype.showPopup = function(offset) {
  var self = this;
  this.popup = L.popup({
      'closeButton': false,
      'autoPan': false
    })
    .setLatLng(this.position(offset))
    .setContent('<p>'+this.data.flightTrack.carrierFsCode+this.data.flightTrack.flightNumber+' '+this.data.flightTrack.departureAirportFsCode+'->'+this.data.flightTrack.arrivalAirportFsCode+'</p>')
    .openOn(this.map.map);

  setInterval(function() {
    self.popup.setLatLng(self.position(offset));
  }, 250);
};

Flight.prototype.showMarker = function() {
  var self = this;
  if (this.marker == null) {
    this.marker = L.marker(this.position()).addTo(this.map.map);
  }

  setInterval(function() {
    self.marker.setLatLng(self.position());
  }, 250);
};

Flight.prototype.initialize = function(data) {
  // console.log("initialize", data);
  this.data = data;
  this.updateData(data);
  if (data.flightTrack.positions.length > 5) {
    this.initializePositions();
    this.buildAirports();
    // this.drawAirports();
    this.drawPoints();
    this.drawArc();
    this.buildTransitions(true);
    this.initialized = true;
    this.plane.attr('fill-opacity', this.planeIconOpacity);
    this.plane.attr('stroke-opacity', this.planeIconOpacity);
    this.startPolling();
  }
};

Flight.prototype.buildAirports = function() {
  var airport;
  // console.log(this.airportData);
  if (this.airportData != null) {
    for (var i = 0; i < this.airportData.length; i++) {
      airport = this.airportData[i];
      airport.svg = this.map.airports.append('svg:text')
        .text(airport.fs)
        .style('fill', this.color);
      if (this.departureAirportCode == airport.fs) {
        this.departureAirport = airport;
      }
      else if (this.arrivalAirportCode == airport.fs) {
        this.arrivalAirport = airport;
      }
    }
  }
};

Flight.prototype.drawAirports = function() {
  this.departureAirport.svg
    .attr('transform', this.transformGenerator([this.departureAirport.longitude, this.departureAirport.latitude]));
  this.arrivalAirport.svg
    .attr('transform', this.transformGenerator([this.arrivalAirport.longitude, this.arrivalAirport.latitude]));
};

Flight.prototype.panTo = function(zoom) {
  if (this.untravelledPositions[0] != null) {
    this.map.map.panTo([this.untravelledPositions[0].lat, this.untravelledPositions[0].lon]);
    if (zoom != null) {
      this.map.map.setZoom(zoom);
    }
  }
};

Flight.prototype.zoomTo = function() {
  if (this.departureAirportLatitude != null && this.departureAirportLongitude != null && this.arrivalAirportLatitude != null && this.arrivalAirportLongitude != null) {
    var bounds = [
      [this.departureAirportLatitude, this.departureAirportLongitude],
      [this.arrivalAirportLatitude, this.arrivalAirportLongitude]
    ];
    this.map.map.fitBounds(bounds);
  }
};

Flight.prototype.initializePositions = function() {
  if (this.data.flightTrack.positions.length <= 5) {
    alert('not enough data');
  }
  else if (this.data.flightTrack.positions.length > 5) {
    // reorder raw positions from oldest to newest so we can push new observations onto the array
    for (var i = this.data.flightTrack.positions.length - 1; i >= 0; i--) {
      this.data.flightTrack.positions[i].hasAnimation = false;
      this.positions.push(this.data.flightTrack.positions[i]);
    }
    if ('waypoints' in this.data.flightTrack) {
      this.waypoints = this.data.flightTrack.waypoints;
    }

    // generate interpolated positions along this path to animate between
    this.buildInterpolatedPositions();
  }
};

Flight.prototype.buildInterpolatedPositions = function() {
  // use these positions to draw an svg line of the flight path using D3's 
  // interpolation (smoothing) to enhace animation experience
  this.path.attr('d', this.map.invisibleLineProjector(this.reformatPositions(this.positions)));
  this.pathLength = this.path.node().getTotalLength();

  var i = 0, 
      interval = 5, 
      position = {}, 
      point = {}, 
      obj = {}, 
      multiplier = 0,
      flooredPathLength = Math.floor(this.pathLength),
      count = Math.floor(this.pathLength / interval);
  // console.log('flooredPathLength', flooredPathLength);
  for (i = 0; i < flooredPathLength; i += interval) {
    multiplier = i / flooredPathLength;
    point = this.path.node().getPointAtLength(multiplier * this.pathLength);
    position = this.map.projection.invert([point.x, point.y]);
    obj = {};
    obj.id = i / interval;
    obj.lat = position[1];
    obj.lon = position[0];
    obj.course = this.positions[Math.floor(multiplier * this.positions.length)].course;
    obj.speedMph = this.positions[Math.floor(multiplier * this.positions.length)].speedMph;

    if (!this.initialized) {
      if (obj.id >= (count - this.initialAnimationPathPointCount)) {
        obj.hasAnimation = false;
        obj.drawn = false;
        this.untravelledPositions.push(obj);
      }
      else {
        obj.hasAnimation = true;
        obj.drawn = true;
        this.travelledPositions.push(obj);
      }  
    }
    else if (obj.id > this.untravelledPositions[this.untravelledPositions.length - 1].id) {
      obj.hasAnimation = false;
      obj.drawn = false;
      this.untravelledPositions.push(obj);
    }
  }
};

Flight.prototype.drawPoints = function() {
  var ref = {}, projectedPoint = {};
  for (var i = this.travelledPositions.length - 1; i >= 0; i--) {
    ref = this.travelledPositions[i];
    projectedPoint = this.map.projectContainerPoint([ref.lon, ref.lat]);
    if (this.map.map.getSize().contains(projectedPoint)) {
      ref.svg = this.map.points.append('circle')
        .datum(ref)
        .attr('cx', projectedPoint[0])
        .attr('cy', projectedPoint[1])
        .attr('r', this.pathPointRadius)
        .style('fill', this.pathColor)
        .attr('fill-opacity', this.pathOpacity);
      ref.drawn = true;
    }
  }
  for (i = this.untravelledPositions.length - 1; i >= 0; i--) {
    ref = this.untravelledPositions[i];
    if (!ref.drawn) {
      projectedPoint = this.map.projectContainerPoint([ref.lon, ref.lat]);
      ref.svg = this.map.points.append('circle')
        .datum(ref)
        .attr('cx', projectedPoint[0])
        .attr('cy', projectedPoint[1])
        .attr('r', this.pathPointRadius)
        .style('fill', this.pathColor)
        .attr('fill-opacity', '0');
      ref.drawn = true;
    }
  }
};

Flight.prototype.addPoints = function() {
  var ref = {}, projectedPoint = {};
  for (var i = this.untravelledPositions.length - 1; i >= 0; i--) {
    ref = this.untravelledPositions[i];
    if (!ref.drawn) {
      projectedPoint = this.map.projectContainerPoint([ref.lon, ref.lat]);
      ref.svg = this.map.points.append('circle')
        .datum(ref)
        .attr('cx', projectedPoint[0])
        .attr('cy', projectedPoint[1])
        .attr('r', this.pathPointRadius)
        .style('fill', this.pathColor)
        .attr('fill-opacity', '0');
      ref.drawn = true;
    }
  }
};

Flight.prototype.removePoints = function() {
  for (var i = this.travelledPositions.length - 1; i >= 0; i--) {
    if (this.travelledPositions[i].svg != null) {
      this.travelledPositions[i].svg.remove();
    }
  }
  for (i = this.untravelledPositions.length - 1; i >= 0; i--) {
    if (this.untravelledPositions[i].svg != null) {
      this.untravelledPositions[i].svg.remove();
    }
  }
};

Flight.prototype.buildTransitions = function(viewreset) {
  var position, nextPosition, transform;
  var mapZoom = this.map.map.getZoom();

  position = this.interpolatedPosition || this.untravelledPositions[0];

  if (mapZoom < 7) {
    nextPosition = this.untravelledPositions[this.untravelledPositions.length - 1];
  }
  else {
    nextPosition = this.untravelledPositions[1];
  }
  
  if (viewreset && position != null && nextPosition != null) {
    transform = this.transformGenerator(position, nextPosition);
    this.plane.attr('transform', transform.transform);
  }
  else if (position == null && nextPosition == null) {
    throw new Error('null or undefined positions');
  }

  if (mapZoom < 7) {
    this.addTransition(position, nextPosition, 0);
  }
  else {
    // console.log(this.flightId, this.untravelledPositions.length);
    for (var i = 0; i < this.untravelledPositions.length; i++) {
      nextPosition = this.untravelledPositions[i + 1];
      if (i === 0 && this.interpolatedPosition != null && viewreset) {
        position = this.interpolatedPosition;
        // this.addTransition(position, nextPosition, i);
      }
      else if (i === 0 && !this.initialized) {
        position = this.untravelledPositions[i];
        if (position != null && nextPosition != null && !position.hasAnimation) {
          this.addTransition(position, nextPosition, i);
        }
      }
      else if (i !== 0) {
        position = this.untravelledPositions[i];
        if (position != null && nextPosition != null && !position.hasAnimation) {
          this.addTransition(position, nextPosition, i-1);
        }
      }
    }
  }
  this.interpolatedPosition = null;
};

Flight.prototype.addTransition = function(position, nextPosition, index) {
  var self = this, transition;
  var transform = self.transformGenerator(position, nextPosition);
  // console.log(transform, position, nextPosition);
  this.transitions[nextPosition.id] = {};

  if (index === 0) {
    this.transitions[position.id] = {};
    this.transitions.time = new Date().getTime();
  }
  
  this.transitions[position.id].position = position;
  this.transitions[position.id].transform = transform;
  this.transitions[position.id].duration = this.animationTime(position.speedMph, distanceTo(position, nextPosition));

  position.delay = this.transitions[position.id].delay = this.transitions[position.id].delay || 0;
  position.duration = this.transitions[position.id].duration = this.transitions[position.id].duration || 0;
  nextPosition.delay = this.transitions[nextPosition.id].delay = this.transitions[position.id].delay + this.transitions[position.id].duration;
  position.transitionTime = this.transitions[position.id].transitionTime = position.delay + this.transitions.time;

  this.transitions[position.id].transition = this.plane
    .transition()
    .delay(this.transitions[position.id].delay)
    .duration(this.transitions[position.id].duration)
    .ease('linear')
    .attr('transform', transform.transform)
    .each('end', function() {
      self.travelledPositions.push(self.untravelledPositions[0]);
      // self.showTravelledPoints();
      self.untravelledPositions.shift();
      // self.untravelledPositions[0].svg.attr('fill-opacity', '1');
    })
    .each('start', function() {
      // self.untravelledPositions[0].svg.attr('fill-opacity', '1');
    });

  position.hasAnimation = true;
};

Flight.prototype.showTravelledPoints = function() {
  if (this.untravelledPositions[1].svg != null) {
    this.untravelledPositions[1].svg.attr('fill-opacity', this.pathOpacity);
  }
  for (var i = 0; i < this.travelledPositions.length; i++) {
    if (this.travelledPositions[i].svg != null) {
      this.travelledPositions[i].svg.attr('fill-opacity', this.pathOpacity);
    }
  }
};

Flight.prototype.hideTravelledPoints = function() {
  if (this.untravelledPositions[1].svg != null) {
    this.untravelledPositions[1].svg.attr('fill-opacity', '0');
  }
  for (var i = 0; i < this.travelledPositions.length; i++) {
    if (this.travelledPositions[i].svg != null) {
      this.travelledPositions[i].svg.attr('fill-opacity', '0');
    }
  }
};

Flight.prototype.showPlan = function() {
  // console.log('showPlan', this.plan.attr('stroke-opacity'));
  if (this.plan != null) {
    this.plan.attr('stroke-opacity', this.planOpacity);  
  }
  else {
    // console.log('plan not defined for', this);
  }
};

Flight.prototype.hidePlan = function() {
  if (this.plan != null) {
    this.plan.attr('stroke-opacity', '0');
  }
  else {
    // console.log('plan not defined for', this);
  }
};

Flight.prototype.drawPlan = function() {
  if (this.waypoints != null) {
    this.plan.attr('d', this.map.projectLine(this.reformatPositions(this.waypoints)));
  }
};


Flight.prototype.drawArc = function() {
  // console.log("calling drawArc");
  this.arc.attr('d', '');
  var self = this;
  
  var arc = d3.geo.greatArc()
      .source(function() { return [self.departureAirport.longitude, self.departureAirport.latitude]; })
      .target(function() { return [self.arrivalAirport.longitude, self.arrivalAirport.latitude]; });

  this.arc.attr('d', self.map.arcProjector(arc()));
};

Flight.prototype.allTransitions = function() {
  return this.plane[0][0].__transition__;
};

Flight.prototype.draw = function(viewreset) {
  // console.log("draw", viewreset);
  var self = this,
      position = {}, 
      nextPosition = {}, 
      transform = '';

  this.removePoints();
  this.cancelTransitions();

  this.path.attr('d', self.map.invisibleLineProjector(self.reformatPositions(self.positions)));
  this.pathLength = self.path.node().getTotalLength();

  if (this.drawPlanFlag) {
    this.drawPlan();
  }
  if (this.drawArcFlag) {
    this.drawArc();
  }

  // this.drawAirports();

  for (var i = 0; i < this.untravelledPositions.length; i++) {
    this.untravelledPositions[i].hasAnimation = false;
    this.untravelledPositions[i].drawn = false;
  }

  this.buildTransitions(viewreset);
  this.drawPoints();
};

Flight.prototype.cancelTransitions = function() {
  this.plane.transition().duration(0);
};

Flight.prototype.remove = function() {
  // console.log('removing flight', this.flightId);
  this.plane.remove();
  this.plan.remove();
  this.removePoints();
  this.arc.remove();
};

Flight.prototype.redraw = function() {
  var self = this,
      position = {}, 
      nextPosition = {}, 
      transform = '';

  this.path.attr('d', self.map.invisibleLineProjector(self.reformatPositions(self.positions)));
  this.pathLength = self.path.node().getTotalLength();
  this.buildInterpolatedPositions();

  if (this.drawPlanFlag) {
    this.drawPlan();
  }
  if (this.drawArcFlag) {
    this.drawArc();
  }

  this.buildTransitions();
  this.addPoints();
};

// these should probably be private
Flight.prototype.activeTransition = function() {
  try {
    return this.plane[0][0].__transition__[this.plane[0][0].__transition__.active];
  }
  catch(e) {
    return null;
  }
};

Flight.prototype.transitionCount = function() {
  try {
    return this.plane[0][0].__transition__.count;
  }
  catch(e) {
    return null;
  }
};

Flight.prototype.startPolling = function() {
  var self = this;
  setInterval(function() {
    self.fetchFlightTracks(5, function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        self.updateData(data);
        self.redraw();
      }
    });
  }, self.pollingRate);
};

Flight.prototype.updateData = function(data) {
  var self = this;
  var maxPositions = this.initialized ? 5 : null;
  var i = 0, position = {}, nextPosition = {}, point = {}, alreadyAdded = false, obj = {};
  if ('departureAirportFsCode' in data.flightTrack) {
    self.departureAirportCode = data.flightTrack.departureAirportFsCode;
  }
  if ('arrivalAirportFsCode' in data.flightTrack) {
    self.arrivalAirportCode = data.flightTrack.arrivalAirportFsCode;
  }

  if ('appendix' in data && 'airports' in data.appendix) {
    for (var i = 0; i < data.appendix.airports.length; i++) {
      if (data.appendix.airports[i].fs === self.departureAirportCode) {
        self.departureAirportLatitude = data.appendix.airports[i].latitude;
        self.departureAirportLongitude = data.appendix.airports[i].longitude;
      }
      else if (data.appendix.airports[i].fs === self.arrivalAirportCode) {
        self.arrivalAirportLatitude = data.appendix.airports[i].latitude;
        self.arrivalAirportLongitude = data.appendix.airports[i].longitude;
      }
    }
  }

  self.waypoints = data.flightTrack.waypoints;
  self.airportData = data.appendix.airports;

  if (self.positions.length > 0) {
    for (i = 0; i < data.flightTrack.positions.length; i++) {
      position = data.flightTrack.positions[i];
      nextPosition = data.flightTrack.positions[i + 1];
      alreadyAdded = false;
      for (var j = 0; j < self.positions.length; j++) {
        if (self.positions[j].date === data.flightTrack.positions[i].date) {
          alreadyAdded = true;
          break;
        }
      }
      if (!alreadyAdded) {
        position.hasAnimation = false;
        self.positions.push(position);
      }
    }
  }
};

Flight.prototype.fetchFlightTracks = function(maxPositions, done) {
  var self = this;

  var options = {
    includeFlightPlan: 'true',
    extendedOptions: 'includeNewFields',
    sourceType: 'raw'
  };

  // var options = {
  //   includeFlightPlan: 'true'
  // };

  if (maxPositions != null) {
    options.maxPositions = maxPositions;
  }

  this.flex.fetchFlightTracksForFlight(this.flightId, options, function(err, data) {
    // console.log(err, data);
    done(err, data, self);
  });
};

// these should be private, too

Flight.prototype.calculateHeading = function(point1, point2) {
  point1 = this.map.projectContainerPoint([point1.lon, point1.lat]);
  point2 = this.map.projectContainerPoint([point2.lon, point2.lat]);
  var y = point2[1] - point1[1];
  var x = point2[0] - point1[0];
  if (x !== 0 && y !== 0) {
    var hypotenuse = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
    var estimatedHeading = Math.atan((y / hypotenuse) / (x / hypotenuse)) * 57.2957795;
    this.lastKnownHeading = x < 0 ? estimatedHeading + 270 : estimatedHeading + 90;
    return this.lastKnownHeading;
  }
  else {
    // console.log("estimatedHeading uncalculable");
    return this.lastKnownHeading;
  }
};

Flight.prototype.reformatPositions = function(positions) {
  var newPositions = [];

  for (var i = 0; i < positions.length; i++) {
    // console.log(positions[i].lon, positions[i].lat);
    newPositions.push([positions[i].lon, positions[i].lat]);
  }

  dateLineProcessor(newPositions);
  return newPositions;
};

Flight.prototype.transformGenerator = function(position, nextPosition) {
  var halfIcon = this.planeIconSize / 2,
      transform, translate, course, rotate;
  if (position != null && nextPosition != null) {
    transform = this.map.projectContainerPoint([position.lon, position.lat]);
    translate = 'translate(' + (transform[0] - halfIcon) + ',' + (transform[1] - halfIcon) + ')'; 
    course = this.calculateHeading(position, nextPosition);
    rotate = 'rotate(' + course + ', ' + halfIcon + ', ' + halfIcon + ')';
    if (isNaN(course)) {
      if (position.course != null) {
        rotate = 'rotate(' + position.course + ', ' + halfIcon + ', ' + halfIcon + ')';
      }
      else {
        rotate = 'rotate(0, ' + halfIcon + ', ' + halfIcon + ')';
      }
    }
    return {
      'translate': translate,
      'rotate': rotate,
      'transform': translate + '' + rotate + 'scale(' + this.planeIconScale + ')'
    };
  }
  // if (position != null && nextPosition != null) {
  //   transform = this.map.projectContainerPoint([position.lon, position.lat]);
  //   translate = 'translate(' + transform[0] + ',' + transform[1] + ')'; 
  //   course = this.calculateHeading(position, nextPosition);
  //   rotate = 'rotate(' + course + ')';
  //   if (isNaN(course)) {
  //     if (position.course != null) {
  //       rotate = 'rotate(' + position.course + ')';
  //     }
  //     else {
  //       rotate = 'rotate(0)';
  //     }
  //   }
  //   return {
  //     'translate': translate,
  //     'rotate': rotate,
  //     'transform': translate + '' + rotate
  //   };
  // }
  else if (position != null) {
    transform = this.map.projectContainerPoint([position[0], position[1]]);
    translate = 'translate(' + transform[0] + ',' + transform[1] + ') scale(' + this.planeIconScale + ')';
    return translate;
  }
  else {
    // console.log('transformGenerator recieved', position, nextPosition);
  }
};

Flight.prototype.animationTime = function(speed, distance) {
  speed = speed * 1.60934; //kph
  distance = distance / 1000; //kilometers
  return (distance / speed) * 60 * 60 * 1000;
};

Flight.prototype.position = function(offset) {
  var point = parseTransform(this.plane.attr('transform'));
  var translate = point.translate;
  var rotate = toRad(point.rotate - 45);
  var sin = Math.sin(rotate);
  var cos = Math.cos(rotate);
  var hyp = this.planeIconSize / 2;

  translate[0] = parseInt(translate[0], 10) + (-1 * sin * hyp) + offset[0];
  translate[1] = parseInt(translate[1], 10) + (1 * cos * hyp) + offset[1];

  if (!isNaN(translate[0]) && !isNaN(translate[1])) {
    return this.map.map.containerPointToLatLng(translate);
  }
};

function toRad(deg) {
  return deg * (Math.PI / 180);
}

function toDeg(rad) {
  return rad * (180 / Math.PI);
}

function dateLineProcessor(positions) {
  var prev, current, next, didPassDateline = 0;
  for (var i = 0; i < positions.length; i++) {
    if ((i - 1) >= 0 && (i + 1) <= positions.length) {
      prev = positions[i - 1];
      current = positions[i];
      next = positions[i + 1];

      // East -> West
      if (prev[0] < 90 && current[0] > 90) {
        didPassDateline = -1;
      }

      // West -> East
      if (current[0] < 90 && prev[0] > 90) {
        didPassDateline = 1;
      }

      if (didPassDateline === 1) {
        current[0] = -180 - (180 - current[0]);
      }
      else if (didPassDateline === -1) {
        current[0] = 180 + (180 + current[0]);
      }
    }
  }
}

function distanceTo(positionA, positionB) {
  var a = L.latLng([positionA.lat, positionA.lon]);
  var b = L.latLng([positionB.lat, positionB.lon]);
  return a.distanceTo(b);
}

function randomHexColor() {
  var dayglo = {
    'green': '#6FFF00',
    'pink': '#FF00FF',
    'yellow': '#FFFF00',
    'blue': '#4D4DFF',
    'red': '#FE0001',
    'orange': '#FF4105',
    'purple': '#993CF3'
  };
  var result;
  var count = 0;
  for (var prop in dayglo) {
    if (Math.random() < 1 / ++count) {
      result = prop;
    }
  }
  return result;
  // return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function parseTransform(a) {
  var b = {};
  for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*,?)+\)+)/g)) {
    var c = a[i].match(/[\w\.\-]+/g);
    b[c.shift()] = c;
  }
  return b;
}
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
  scripts: ['js/*.js']
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['build'], cb);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts']);
var fsBasePath = '/data/';

var Map = function(config) {
	// console.log("map config", config);
	var self = this;
	config.subdomains = config.subdomains || 'abcd';
	this.flexConfig = config.flexConfig;
	this.flex = new Flex(this.flexConfig);
	this.mapId = config.id || 'map';
	this.map = L.map(this.mapId, config.leaflet)
		.setView([0, 0], config.initialZoom || 10)
		.addLayer(L.tileLayer(config.tiles, {'subdomains': config.subdomains}));
  	this.data = {};
	this.svg = d3.select(this.map.getPanes().overlayPane).append('svg');
	this.plans = this.svg.append('g')
		.attr('class', 'leaflet-zoom-hide')
		.attr('id', 'plans');
	this.arcs = this.svg.append('g')
		.attr('class', 'leaflet-zoom-hide')
		.attr('id', 'arcs');
	this.points = this.svg.append('g')
		.attr('class', 'leaflet-zoom-hide')
		.attr('id', 'points');
	this.planes = this.svg.append('g')
		.attr('class', 'leaflet-zoom-hide')
		.attr('id', 'planes');
	this.airports = this.svg.append('g')
		.attr('class', 'leaflet-zoom-hide')
		.attr('id', 'airports');
	// these 'paths' are used only for interpolating the points that we draw and
	// animate between, they are not drawn
	this.paths = this.svg.append('g')
		.attr('class', 'leaflet-zoom-hide')
		.attr('id', 'paths');
	this.flights = {};
	this.airportConfig = config.airportConfig || {};
  	this.flightConfig = config.flightConfig || {};
  	this.airportConfig.flexConfig = this.flexConfig;
  	this.flightConfig.flexConfig = this.flexConfig;

	this.map.on('viewreset', function() {
		// console.log('viewreset');
	  // self.reset();
	});

	this.map.on('zoomend', function() {
		// console.log('zoomend');
	  // self.reset();
	});

	this.map.on('moveend', function() {
		// console.log('moveend');
		// self.saveAnimationPositions();
	  self.reset();
	});

	this.map.on('resize', function() {
		// alert('resize');
	  // self.reset();
	  // console.log('resize');
	});	

	this.map.on('focus', function() {
		// console.log('focus');
		// alert('focus');
	  // self.reset();
	});

	this.map.on('blur', function() {
		// alert('blur');
	  // self.reset();
	  // console.log('blur');
	});

	this.map.on('movestart', function() {
		// console.log('movestart');
	  self.saveAnimationPositions();
	});

	this.map.on('zoomstart', function() {
		// console.log('zoomstart');
	  // self.saveAnimationPositions();
	});

	this.projection = d3.geo.mercator()
		.scale(10000)
    .precision(.1);

	this.invisibleLineProjector = d3.svg.line()
 	  .x(function(d) {
 	    var point = self.projection(d);
 	    return point[0];
 	  })
 	  .y(function(d) {
 	    var point = self.projection(d);
 	    return point[1];
 	  })
 	  .interpolate('cardinal');

 	this.arcProjector = d3.geo.path().projection(project);

 	function project(x) {
  	var point = self.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
  	return [point.x, point.y];
	}

	this.projectLine = d3.svg.line()
 	  .x(function(d) {
 	    var location = L.latLng(d[1], d[0]);
 	    var point = self.map.latLngToContainerPoint(location);
 	    return point.x;
 	  })
 	  .y(function(d) {
 	    var location = L.latLng(d[1], d[0]);
 	    var point = self.map.latLngToContainerPoint(location);
 	    return point.y;
 	  })
 	  .interpolate('cardinal');

  this.projectLayerPoint = function(x) {
    var point = self.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
  };

  this.projectContainerPoint = function(x) {
    var point = self.map.latLngToContainerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
  };
};

Map.prototype.panTo = function(latLng) {
	this.map.panTo(latLng);
};

Map.prototype.addFlight = function(flightId, done) {
	var self = this;

	self.flights[flightId] = new Flight(flightId, self.flightConfig, self);
	self.flights[flightId].fetchFlightTracks(null, function(err, data, flight) {
		// console.log(flightId);
		if (err) {
			console.log(err);
		}
		else if (data.error) {
			console.log(data.error.errorMessage);
		}
		else {
			// console.log("initializing flight", flightId);
			flight.initialize(data);
		}
		if (done != null) done(err, flight);
	});
};

Map.prototype.addAirport = function(flight) {

};

Map.prototype.clear = function() {
	this.plans.html('');
	this.arcs.html('');
	this.points.html('');
	this.planes.html('');
	this.airports.html('');
};

Map.prototype.removeFlight = function(flight) {
	flight.remove();
	delete flight;
};

Map.prototype.removeFlights = function() {
	for (var flight in this.flights) {
		this.flights[flight].remove();
		this.flights[flight] = {};
		delete this.flights[flight];
	}
};

Map.prototype.removeAirport = function(flight) {

};

Map.prototype.reset = function() {
	// console.log("reset");
	var bounds = this.map.getBounds();

	var bottomLeft = this.projectLayerPoint([bounds.getWest(), bounds.getSouth()]),
	    topRight = this.projectLayerPoint([bounds.getEast(), bounds.getNorth()]);

	this.paths.selectAll("*").remove();
	this.points.selectAll("*").remove();
  // console.log("Removing arcs");
  this.arcs.selectAll("*").remove();
	this.svg
    .attr('width', topRight[0] - bottomLeft[0])
    .attr('height', bottomLeft[1] - topRight[1])
    .style('margin-left', bottomLeft[0] + 'px')
    .style('margin-top', topRight[1] + 'px');

  this.arcs
    .style('margin-left', -bottomLeft[0] + 'px')
    .style('margin-top', -topRight[1] + 'px');

	for (var flight in this.flights) {
	  if (this.flights[flight].initialized) {
	  	this.flights[flight].draw(true);
	  }
	}
};

Map.prototype.saveAnimationPositions = function() {
  // console.log("saveAnimationPositions");
  // This function interpolates the geographic position of the plane using the transition progress.
  // This is called when zooming or panning starts so the plane is redrawn in the expected position.
  for (var flight in this.flights) {
    var position = this.flights[flight].travelledPositions[this.flights[flight].travelledPositions.length - 1];
    var nextPosition = this.flights[flight].untravelledPositions[0];

    if (position != null && nextPosition != null) {
    	// if (position.delay === nextPosition.delay) {
    	// 	progress = (new Date().getTime() - this.flights[flight].transitions.time) / position.duration;
    	// }
    	// console.log(position, nextPosition);
    	// console.log(new Date().getTime() - this.flights[flight].transitions.time, position.delay, position.duration, nextPosition.delay, nextPosition.duration);
    	var dividend = new Date().getTime() - this.flights[flight].transitions.time;
    	var divisor = nextPosition.duration;
    	var progress = dividend / divisor;
    	
    	// Yeah, something's wrong with this math - but we known progress should never be > 1
    	if (progress > 1) {
    		// console.log("progress is", progress);
    		progress = 1;
    	}

    	var interpolater = d3.geo.interpolate([position.lon, position.lat], [nextPosition.lon, nextPosition.lat]);
    	var interpolatedPoint = interpolater(progress);

    	this.flights[flight].interpolatedPosition = {};
    	this.flights[flight].interpolatedPosition.lat = interpolatedPoint[1];
    	this.flights[flight].interpolatedPosition.lon = interpolatedPoint[0];
    	this.flights[flight].interpolatedPosition.speedMph = position.speedMph;
    	this.flights[flight].interpolatedPosition.course = position.course;

    	this.flights[flight].plane.transition().duration(0);
    }
    else {
    	console.log("No positions for flight", flight);
    }
  }
};

Map.prototype.fetchActiveFlightsForAirport = function(fsAirportCode, maxFlights, done) {
	var self = this;
	var airportPath = [
	  fsBasePath,
	  'flightstatus/rest/v2/json/airport/tracks/',
	  fsAirportCode,
	  '/dep?maxFlights=',
	  maxFlights
	];
	
	airportPath = airportPath.join('');

	d3.json(airportPath, function(err, data) {
	  if (err) {
	    console.log('Request Error:', err);
	  }
	  else {
      self.data = data;
	  }
    done(err);
	});
};

Map.prototype.buildFlights = function() {
  var self = this;
  for (i = 0; i < self.data.flightTracks.length; i++) {
    if (self.data.flightTracks[i].positions.length > 0) {
      document.flight = self.flights[self.data.flightTracks[i].flightId] = new Flight(self.data.flightTracks[i].flightId, self.flightConfig, self);
      self.flights[self.data.flightTracks[i].flightId].fetchFlightTracks(null, function(err, data, flight) {
      	if (err) {
      		console.log(err);
      	}
      	else {
      		flight.initialize(data);
      		self.reset();
      	}
      });
    }
  }
};