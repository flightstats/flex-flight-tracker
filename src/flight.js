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