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