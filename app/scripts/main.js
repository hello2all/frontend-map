'use strict'; // turn on Strict Mode


/*
MVVM
*/

// Point of interest object, with marker and infowindow linked
function POI(location){
  var self = this;
  self.name = location.name;
  self.wikiurl = location.wikiurl;
  // Bind marker to this object
  self.marker = new google.maps.Marker({
    position: new google.maps.LatLng(location.lat,location.lng),
    map: map
  });
  markers.push(self.marker);

  // Event listener when the marker is clicked
  self.marker.addListener('click', function() {
    // reset all animations
    for(var i = 0; i < markers.length; i++){
      markers[i].setAnimation(null);
    }
    // Activate animation
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    // retrieve async data and display in infowindow
    ShowWiki(self.marker,infowindow,self.wikiurl);
  });
  // Visibility in map
  self.markerVisible = function(toggleSwitch) {
    if (toggleSwitch) {
      self.marker.setVisible(true);
    } else {
      self.marker.setVisible(false);
    }
  };

  // Style change in list
  self.selected = ko.observable(false); // Flag for selected item in list
}

// ViewModel
function AppViewModel() {
  var self = this;
  // initialize search string
  self.filter = ko.observable('');

  // initialize Point of interests observable array
  self.POIs = ko.observableArray([]);
  museums.forEach(function(location){
    self.POIs.push(new POI(location));
  });
  // Location filter
  self.filteredPOIs = ko.computed(function () {
    var filter = self.filter().toLowerCase(); // case insensitive

    return ko.utils.arrayFilter(self.POIs(), function (POI) {
      var doesmatch =  POI.name.toLowerCase().indexOf(filter) !== -1;
      // Change visibility
      POI.markerVisible(doesmatch);
      return doesmatch;
    });
  }, self);


  // initialize current POI in list
  self.currentPOI = self.POIs()[0];
  // Change focus on selected item
  self.select = function(selectedPOI){
    self.currentPOI.selected(false);
    self.currentPOI = selectedPOI;
    self.currentPOI.selected(true);
    // trigger marker click event
    google.maps.event.trigger(self.currentPOI.marker, 'click');
  };
}


/*
Map Model
*/
var map,   // declares a global map variable
    infowindow, // global infowindow
    markers = []; // array for all generated markers

function initializeMap() {

  var locations;
  var mapOptions = {
    center: new google.maps.LatLng(1.286826, 103.854543),
    zoom: 14,
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  // init infowindow
  infowindow = new google.maps.InfoWindow({
    maxWidth: 300
  });

  // stop marker animation when infowindow is closed
  google.maps.event.addListener(infowindow, 'closeclick', function() {
      markers.forEach(function(marker){
        marker.setAnimation(null);
      });
  });
  // Activates knockout.js
  ko.applyBindings(new AppViewModel());
}
/*
google maps async error handling
*/
function mapInitErr(){
  $('main').append('<p>google maps was stolen T_T, try to refresh this page</p>');
}

/*
Asynchronously retrieve info from wikipedia
*/
function ShowWiki(marker,infowindow,wikiurl)
{
  infowindow.setPosition(marker.getPosition());
  infowindow.setContent('<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
  infowindow.open(map,marker);
  // construct parse url to retrieve the first section
  var parseUrl = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&callback=?&page=' + wikiurl.replace('https://en.wikipedia.org/wiki/', '');
  var HTMLlink = '<p><a href=\'%data%\'>More info...</a></p>';
  $.ajax({
    type: 'GET',
    url: parseUrl,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
      // parse results
      var markup = data.parse.text['*'];
      // convert string to jquery object for further proccessing
      var i = $('<div></div>').html(markup);

      // remove links as they will not work
      i.find('a').each(function() { $(this).replaceWith($(this).html()); });
      // remove any references
      i.find('sup').remove();
      // remove cite error
      i.find('.mw-ext-cite-error').remove();
      // strip out passages
      i = i.find('p').html();
      // load results into infowindow
      infowindow.setContent(i + HTMLlink.replace('%data%',wikiurl));

    },
    error: function () {
      // throw error message
      infowindow.setContent('Error on retrieving intro from wikipedia');
    }
  });
}
