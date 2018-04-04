var map;


function initialize() {
  initMap();
}

//set map and position
function initMap() {

  console.log("getting data");
  var startpos = {
    lat: 40.728923,
    lng: -73.996593
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: startpos,
    mapTypeId: 'satellite'
  });
  map.setTilt(45);
  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  })
  var bikelayer = new google.maps.BicyclingLayer();
  bikelayer.setMap(map);

  bikelocation();
}

function mapview(marker) {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: marker,
    mapTypeId: 'satellite'
  });
}


function streetview(marker) {
  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('map'), {
      position: marker,
      streeViewControl: false,
      disableDefaultUI: true
    })
}
//
// function bikelocation() {
//   $.ajax({
//     url: "https://feeds.citibikenyc.com/stations/stations.json",
//     type: 'GET',
//     dataType: "json",
//     crossDomain: true,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Origin": "https://127.0.0.1:8080/",
//     },
//     error: function(err) {
//       console.log(err);
//     },
//     success: function(data) {
//       console.log("here is data")
//     }
//   })

function bikelocation() {
  $.ajax({
    url: "https://feeds.citibikenyc.com/stations/stations.json",
    type: 'GET',
    dataType: "json",
    crossDomain: true,
    error: function(err) {
      console.log(err);
    },
    success: function(data) {
      console.log("getting fresh data")
      for (var i = 0; i < data.stationBeanList.length; i++) {
        let coords = {
          lat: data.stationBeanList[i].latitude,
          lng: data.stationBeanList[i].longitude
        }
        let stationName = data.stationBeanList[i].stationName
        let availableBikes = data.stationBeanList[i].availableBikes

        let contentstring = "<div>" + "StationName: " + stationName + " <br> " + "AvailableBikes: " + availableBikes + "</div>"

        let infowindow = new google.maps.InfoWindow({
          content: contentstring
        });
        //console.log(infowindow);

        var image = "cycling.png"
        let latlng = new google.maps.LatLng(coords.lat, coords.lng);
        let marker = new google.maps.Marker({
          position: latlng,
          map: map,
          icon: image,
          content: contentstring
        })
        marker.addListener('mouseover', function() {
          infowindow.open(map, marker);
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
        })
        marker.addListener('click', function() {
          streetview(marker.position);
        })
        document.getElementById('exitstreetview').addEventListener('click', function() {
          map.getStreetView().remove();
          console.log("KEYPRESSED")
        })
      }
    }
  })
}



function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      })
    } else {
      alert('Geocode was not succesfull for the following reason :' + status)
    }
  });


}
