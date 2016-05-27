"use strict";function POI(e){var a=this;a.name=e.name,a.wikiurl=e.wikiurl,a.marker=new google.maps.Marker({position:new google.maps.LatLng(e.lat,e.lng),map:map}),markers.push(a.marker),a.infowindow=new google.maps.InfoWindow({content:a.name,maxWidth:300}),infowindows.push(a.infowindow),a.marker.addListener("click",function(){for(var e=0;e<markers.length;e++)markers[e].setAnimation(null),infowindows[e].close();a.marker.setAnimation(google.maps.Animation.BOUNCE),ShowWiki(a.marker,a.infowindow,a.wikiurl)}),a.isVisible=ko.observable(!1),a.isVisible.subscribe(function(e){e?a.marker.setMap(map):a.marker.setMap(null)}),a.isVisible(!0),a.selected=ko.observable(!1)}function AppViewModel(){var e=this;e.filter=ko.observable(""),e.POIs=ko.observableArray([]),museums.forEach(function(a){e.POIs.push(new POI(a))}),e.filteredPOIs=ko.computed(function(){var a=e.filter().toLowerCase();return a?ko.utils.arrayFilter(e.POIs(),function(e){var i=-1!==e.name.toLowerCase().indexOf(a);return e.isVisible(i),i}):e.POIs()},e),e.currentPOI=e.POIs()[0],e.select=function(a){e.currentPOI.selected(!1),e.currentPOI=a,e.currentPOI.selected(!0),google.maps.event.trigger(e.currentPOI.marker,"click")}}function initializeMap(){var e={center:new google.maps.LatLng(1.286826,103.854543),zoom:14,disableDefaultUI:!0};map=new google.maps.Map(document.getElementById("map_canvas"),e),ko.applyBindings(new AppViewModel)}function ShowWiki(e,a,i){var r="http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&callback=?&page="+i.replace("https://en.wikipedia.org/wiki/",""),n="<p><a href='%data%'>More info...</a></p>";$.ajax({type:"GET",url:r,contentType:"application/json; charset=utf-8",dataType:"json",success:function(r,t,o){var s=r.parse.text["*"],d=$("<div></div>").html(s);d.find("a").each(function(){$(this).replaceWith($(this).html())}),d.find("sup").remove(),d.find(".mw-ext-cite-error").remove(),d=d.find("p").html(),a.setContent(d+n.replace("%data%",i)),a.open(map,e)},error:function(){alert("Error on retrieving intro from wikipedia")}})}var museums=[{name:"ArtScience Museum",address:"10 Bayfront Ave.",wikiurl:"https://en.wikipedia.org/wiki/ArtScience_Museum",crossStreet:"Marina Bay Sands",lat:1.2860434088214237,lng:103.859703540802,distance:8444,postalCode:"018956",cc:"SG",city:"Singapore",country:"Singapore",formattedAddress:["10 Bayfront Ave. (Marina Bay Sands)","018956","Singapore"]},{name:"SAM at 8Q",address:"8 Queen St",wikiurl:"https://en.wikipedia.org/wiki/8Q_SAM",crossStreet:"Bras Basah Rd",lat:1.2974596023559193,lng:103.851789,distance:7538,postalCode:"188535",cc:"SG",city:"Singapore",country:"Singapore",formattedAddress:["8 Queen St (Bras Basah Rd)","188535","Singapore"]},{name:"Asian Civilisations Museum",address:"1 Empress Pl.",wikiurl:"https://en.wikipedia.org/wiki/Asian_Civilisations_Museum",crossStreet:"Fullerton Road",lat:1.287235894855731,lng:103.85206308368407,distance:7585,postalCode:"179555",cc:"SG",city:"Singapore",country:"Singapore",formattedAddress:["1 Empress Pl. (Fullerton Road)","179555","Singapore"]},{name:"National Galalery Singapore",address:"1 St. Andrew's Road",wikiurl:"https://en.wikipedia.org/wiki/National_Gallery_Singapore",lat:1.2902051452344496,lng:103.85153889656067,distance:7504,postalCode:"178957",cc:"SG",city:"Singapore",country:"Singapore",formattedAddress:["1 St. Andrew's Road","178957","Singapore"]},{name:"National Museum of Singapore",address:"93 Stamford Rd",wikiurl:"https://en.wikipedia.org/wiki/National_Museum_of_Singapore",lat:1.2967909719264816,lng:103.84858846664429,distance:7178,postalCode:"178897",cc:"SG",city:"Singapore",country:"Singapore",formattedAddress:["93 Stamford Rd","178897","Singapore"]},{name:"Peranakan Museum",address:"39 Armenian St.",wikiurl:"https://en.wikipedia.org/wiki/Peranakan_Museum",lat:1.2942303498133292,lng:103.84923223811441,distance:7240,postalCode:"179941",cc:"SG",city:"Singapore",country:"Singapore",formattedAddress:["39 Armenian St.","179941","Singapore"]},{name:"Singapore Art Museum",address:"71 Bras Basah Rd.",wikiurl:"https://en.wikipedia.org/wiki/Singapore_Art_Museum",crossStreet:"Opp SMU",lat:1.2972674699862363,lng:103.85109492786576,distance:7460,postalCode:"189555",cc:"SG",city:"Singapore",country:"Singapore",formattedAddress:["71 Bras Basah Rd. (Opp SMU)","189555","Singapore"]},{name:"Baba House",address:"157 Neil Rd.",wikiurl:"https://en.wikipedia.org/wiki/Baba_House",lat:1.2775352294567568,lng:103.83728105838811,distance:6166,postalCode:"088883",cc:"SG",city:"Singapore",country:"Singapore",formattedAddress:["157 Neil Rd.","088883","Singapore"]}],map,markers=[],infowindows=[];