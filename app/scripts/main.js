var museums = [
  {
    "name": "ArtScience Museum",
    "address": "10 Bayfront Ave.",
    "wikiurl":"https://en.wikipedia.org/wiki/ArtScience_Museum",
    "crossStreet": "Marina Bay Sands",
    "lat": 1.2860434088214237,
    "lng": 103.859703540802,
    "distance": 8444,
    "postalCode": "018956",
    "cc": "SG",
    "city": "Singapore",
    "country": "Singapore",
    "formattedAddress": ["10 Bayfront Ave. (Marina Bay Sands)", "018956", "Singapore"]
  },
  {
    "name": "SAM at 8Q",
    "address": "8 Queen St",
    "wikiurl":"https://en.wikipedia.org/wiki/8Q_SAM",
    "crossStreet": "Bras Basah Rd",
    "lat": 1.2974596023559193,
    "lng": 103.851789,
    "distance": 7538,
    "postalCode": "188535",
    "cc": "SG",
    "city": "Singapore",
    "country": "Singapore",
    "formattedAddress": ["8 Queen St (Bras Basah Rd)", "188535", "Singapore"]
  },
  {
    "name": "Asian Civilisations Museum",
    "address": "1 Empress Pl.",
    "wikiurl":"https://en.wikipedia.org/wiki/Asian_Civilisations_Museum",
    "crossStreet": "Fullerton Road",
    "lat": 1.287235894855731,
    "lng": 103.85206308368407,
    "distance": 7585,
    "postalCode": "179555",
    "cc": "SG",
    "city": "Singapore",
    "country": "Singapore",
    "formattedAddress": ["1 Empress Pl. (Fullerton Road)", "179555", "Singapore"]
  },
  {
    "name": "National Galalery Singapore",
    "address": "1 St. Andrew's Road",
    "wikiurl":"https://en.wikipedia.org/wiki/National_Gallery_Singapore",
    "lat": 1.2902051452344496,
    "lng": 103.85153889656067,
    "distance": 7504,
    "postalCode": "178957",
    "cc": "SG",
    "city": "Singapore",
    "country": "Singapore",
    "formattedAddress": ["1 St. Andrew's Road", "178957", "Singapore"]
  },
  {
    "name": "National Museum of Singapore",
    "address": "93 Stamford Rd",
    "wikiurl":"https://en.wikipedia.org/wiki/National_Museum_of_Singapore",
    "lat": 1.2967909719264816,
    "lng": 103.84858846664429,
    "distance": 7178,
    "postalCode": "178897",
    "cc": "SG",
    "city": "Singapore",
    "country": "Singapore",
    "formattedAddress": ["93 Stamford Rd", "178897", "Singapore"]
  },
  {
    "name": "Peranakan Museum",
    "address": "39 Armenian St.",
    "wikiurl":"https://en.wikipedia.org/wiki/Peranakan_Museum",
    "lat": 1.2942303498133292,
    "lng": 103.84923223811441,
    "distance": 7240,
    "postalCode": "179941",
    "cc": "SG",
    "city": "Singapore",
    "country": "Singapore",
    "formattedAddress": ["39 Armenian St.", "179941", "Singapore"]
  },
  {
    "name": "Singapore Art Museum",
    "address": "71 Bras Basah Rd.",
    "wikiurl":"https://en.wikipedia.org/wiki/Singapore_Art_Museum",
    "crossStreet": "Opp SMU",
    "lat": 1.2972674699862363,
    "lng": 103.85109492786576,
    "distance": 7460,
    "postalCode": "189555",
    "cc": "SG",
    "city": "Singapore",
    "country": "Singapore",
    "formattedAddress": ["71 Bras Basah Rd. (Opp SMU)", "189555", "Singapore"]
  },
  {
    "name": "Baba House",
    "address": "157 Neil Rd.",
    "wikiurl":"https://en.wikipedia.org/wiki/Baba_House",
    "lat": 1.2775352294567568,
    "lng": 103.83728105838811,
    "distance": 6166,
    "postalCode": "088883",
    "cc": "SG",
    "city": "Singapore",
    "country": "Singapore",
    "formattedAddress": ["157 Neil Rd.", "088883", "Singapore"]
  }
];

/*
MVVM
*/
// Point of interest object
function POI(location){
  var self = this;
  self.name = location.name;
  self.wikiurl = location.wikiurl;
  self.marker = new google.maps.Marker({
    position: new google.maps.LatLng(location.lat,location.lng),
    map: map
  });
  self.infowindow = new google.maps.InfoWindow({
    content: self.name,
    maxWidth: 300
  });

  self.marker.addListener('click', function() {
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    ShowWiki(self.marker,self.infowindow,self.wikiurl);
  });
  self.selected = ko.observable(false); // Flag for selected item in list
}
function AppViewModel() {
  var self = this;
  // initialize search string
  self.filter = ko.observable('');

  // initialize Point of interests observable array
  self.POIs = ko.observableArray([]);
  museums.forEach(function(location){
    self.POIs.push(new POI(location));
  });

  self.filteredPOIs = ko.computed(function () {
    var filter = self.filter().toLowerCase();
    if (!filter) {
      return self.POIs();
    } else {
      return ko.utils.arrayFilter(self.POIs(), function (POI) {
        return POI.name.toLowerCase().indexOf(filter) !== -1;
      });
    }}, self);

  self.reset = function(){
    self.POIs().forEach(function(POI){
      POI.infowindow.close();
      POI.marker.setAnimation(null);
    });
  };
  // initialize current POI
  self.currentPOI = self.POIs()[0];
  // Change focus on selected item
  self.select = function(selectedPOI){
    self.currentPOI.selected(false);
    self.currentPOI = selectedPOI;
    self.currentPOI.selected(true);
    self.reset();
    google.maps.event.trigger(self.currentPOI.marker, 'click');
  };
}



var map;    // declares a global map variable
var markers = [];
var infowindows = [];
function initializeMap() {

  var locations;
  var mapOptions = {
    center: new google.maps.LatLng(1.286826, 103.854543),
    zoom: 14,
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  // Activates knockout.js
  ko.applyBindings(new AppViewModel());
}

/*
Asynchronously retrieve info from wikipedia
*/
function ShowWiki(marker,infowindow,wikiurl)
{
  // construct parse url to retrieve the first section
  var parseUrl = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&callback=?&page=" + wikiurl.replace("https://en.wikipedia.org/wiki/", "");
  var HTMLlink = "<p><a href='%data%'>More info...</a></p>";
  $.ajax({
    type: "GET",
    url: parseUrl,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      // parse results
      var markup = data.parse.text["*"];
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
      infowindow.setContent(i + HTMLlink.replace("%data%",wikiurl));
      infowindow.open(map,marker);
    },
    error: function () {
      // throw error message
      alert("Error on retrieving intro from wikipedia");
    }
  });
}
