/*
MVVM
*/
// Point of interest object
function POI(name){
  var self = this;
  self.name = name;
  self.selected = ko.observable(false); // Flag for selected item in list
}
function AppViewModel() {
  var self = this;
  // initialize search string
  self.SearchVal = ko.observable("");
  // initialize Point of interests observable array
  self.POIs = ko.observableArray([]);
  // Update list and map once a new search is conducted
  self.Update = function (){
    var keyword = self.SearchVal().toString();
    // Construct search query for foursquare according to SearchVal
    function ConstructQuery(){
      // Credentials for foursquareAPI
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
    // Ajax search to get json results
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
        alert("Ajax error");
      });
  };
  // initialize current POI
  self.currentPOI = new POI();
  // Change focus on selected item
  self.select = function(selectedPOI){
    self.currentPOI.selected(false);
    self.currentPOI = selectedPOI;
    self.currentPOI.selected(true);
  };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

var map;    // declares a global map variable
function initializeMap() {

  var locations;
  var mapOptions = {
    center: new google.maps.LatLng(1.293334,103.784176),
    zoom: 12,
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  // Adds a marker on the map.
  function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markers.push(marker);
  }
  google.maps.event.addDomListener(document.getElementById('myNavlist'), 'click', function(e) {
    window.alert('List was clicked!');
    console.log(e);
  });
}
