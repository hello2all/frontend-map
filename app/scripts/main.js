/*
MVVM
*/
function POI(name){
  var self = this;
  self.name = name;
  self.selected = ko.observable(false);
}
function AppViewModel() {
  var self = this;
  self.SearchVal = ko.observable("");
  self.POIs = ko.observableArray([]);

  self.Update = function (){
    var keyword = self.SearchVal().toString();
    function ConstructQuery(){
      var FSid = "CPTLZ2ZUS0UDLU3IQX2HXPN3CDUC1S2AULTWLI3LQRS0FHME";
      var FSclientsecret = "XA4TANSDMYHH4OCTJOOGJZZBGK1TISIKBAZFAQ11T0X40AFS";
      var FSv = "20130815";
      var FSll = "1.293334,103.784176";
      var FSlimit = "10";

      var query = "https://api.foursquare.com/v2/venues/search?" +
      "client_id="+ FSid +
      "&client_secret=" + FSclientsecret +
      "&v=" + FSv +
      "&ll=" + FSll +
      "&limit=" + FSlimit +
      "&query=" + keyword;

      return query;
    }
    var foursquareAPI = ConstructQuery(keyword);
    $.getJSON( foursquareAPI, {
      tagmode: "any",
      format: "json"
    })
      .done(function( data ) {
        self.POIs([]);
        $.each( data.response.venues, function( i, item ) {
          self.POIs.push(new POI(item.name));
        });
      })
      .fail(function(){
        console.log("Ajax error");
      });
  };
  self.currentPOI = new POI();
  self.select = function(selectedPOI){
    self.currentPOI.selected(false);
    self.currentPOI = selectedPOI;
    self.currentPOI.selected(true);
  };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

var map;    // declares a global map variable
/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

  var locations;

  var mapOptions = {
    disableDefaultUI: true
  };

  /*
  For the map to be displayed, the googleMap var must be
  appended to #mapDiv in resumeBuilder.js.
  */
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);


  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  function locationFinder() {

    // initializes an array
    var locations = ['beijing','shanghai','singapore'];
    return locations;
  }

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      // your code goes here!
      infoWindow.open(map, marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
      locations.forEach(function(place){
      // the search request object
      var request = {
        query: place
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    });
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}

/*
Uncomment the code below when you're ready to implement a Google Map!
*/

// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});
