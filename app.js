
//Model
var Location = function(data) {
    var self = this;
    self.title = data.title;
    self.location = data.location;
    self.showMe = ko.observable(true);
};

//View Model
var ViewModel = function() {
    var self = this;
    self.showMapMessage = ko.observable(false);
    self.showErrorMessage = ko.observable(false);
    self.places = ko.observableArray(locations);
    self.query = ko.observable('');
    self.filteredLocations = ko.observableArray();
    
    for (var i = 0; i < locations.length; i++) {
        var place = new Location(locations[i]);
        self.filteredLocations.push(place);
    }
    //Search all available locations for ones whose names match the search queries and add them to the array
    self.filterFunction = ko.computed(function() {
        var value = self.query();
        for (var i = 0; i < self.filteredLocations().length; i++) {
            if (self.filteredLocations()[i].title.toLowerCase().indexOf(value) >= 0) {
                self.filteredLocations()[i].showMe(true);
                if (self.filteredLocations()[i].marker) {
                    self.filteredLocations()[i].marker.setVisible(true);
                }
            } else {
                self.filteredLocations()[i].showMe(false);
                if (self.filteredLocations()[i].marker) {
                    self.filteredLocations()[i].marker.setVisible(false);
                }
            }
        }
    });

    // Show the relevant marker when a user clicks a location from the list
    self.showInfo = function (locations) {
        google.maps.event.trigger(locations.marker, 'click');
       
    };    

};
       

// This function populates the infowindow when the marker is clicked. 
function populateInfoWindow(marker, infowindow) {
    console.log(marker);
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent('loading...');
        infowindow.open(map, marker);

        var client_id = 'BHU3FSEQDCGVDVFR1MYUNCKJK0HIUZ4SSLPMLDNQTWJCQBNG',
            client_secret = 'QWJVQ0MLI1U4L0ZVHB4W5OJKPYGQEK2GPBF4LQNQJHVBV45X',
            query = "restaurant",
            location, 
            venue;

        $.ajax({
            url:'https://api.foursquare.com/v2/venues/search',
            dataType: 'json',
            data:   {
                limit: '1',
                ll: '40.707496,-73.990774',
                query: marker.title,
                client_id: client_id,
                client_secret: client_secret,
                v: '20161113'
            }
         }).done(function (data) { 
             // If incoming data has a venues object set the first one to the var venue
             venue = data.response.hasOwnProperty("venues") ? data.response.venues[0] : '';

             // If the new venue has a property called location set that to the variable location
             location = venue.hasOwnProperty('location') ? venue.location : '';
             // If new location has prop address then set the observable address to that or blank
             if (location.hasOwnProperty('address')) {
                 var address = location.address || '';
             }

            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div><p>' + address + '</p>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });

         }).fail(function (e) {
             infowindow.setContent('<h5>Foursquare data is unavailable.</h5>');
             self.showMessage(true);
         });


        
    }
}

var map;

// Create a new blank array for all the listing markers.
var markers = [];

var initMap = function() {
    //Create a new map 
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.707496,
            lng: -73.990774
        },
        zoom: 13,
        mapTypeControl: false
    });

    var largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < vm.filteredLocations().length; i++) {
        // Get the position from the location array.
        var position = vm.filteredLocations()[i].location;
        var title = vm.filteredLocations()[i].title;
        console.log(vm.filteredLocations()[i].address);
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            map: map
        });
        vm.filteredLocations()[i].marker = marker;
        // Push the marker to our array of markers.
        //markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            //Add functionaility to animate markers
            var self = this;
            self.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                self.setAnimation(null);
            }, 1400);
            populateInfoWindow(this, largeInfowindow);
        });
    }
}

var locations = [{
        title: 'Dough',
        location: {
            lat: 40.689023,
            lng: -73.957131
        }
    }, {
        title: 'Emmy Squared',
        location: {
            lat: 40.712170,
            lng: -73.955706
        }
    }, {
        title: 'Hometown Bar-B-Que',
        location: {
            lat: 40.674925,
            lng: -74.016162
        }
    }, {
        title: 'Frankies Spuntino 457',
        location: {
            lat: 40.678004,
            lng: -74.001539
        }
    }, {
        title: 'Peter Pan Donut & Pastry Shop',
        location: {
            lat: 40.727663,
            lng: -73.950980
        }
    }, {
        title: 'St. Anselm',
        location: {
            lat: 40.714273,
            lng: -73.956057
        }
    }, {
        title: 'Speedy Romeo',
        location: {
            lat: 40.687517,
            lng: -73.960001
        }
    }, {
        title: 'Cafe Mogador',
        location: {
            lat: 40.719731,
            lng: -73.960004
        }
    }, {
        title: 'Hibino',
        location: {
            lat: 40.690149,
            lng: -73.996381
        }
    }, {
        title: 'Rucola',
        location: {
            lat: 40.685576,
            lng: -73.985893
        }
    }];


    
//Show error message when Google Map is unavailable
function googleError() {
    vm.showMapMessage(true);
}

var vm = new ViewModel();
ko.applyBindings(vm);

filteredLocations.addEventListener('click', function(e) {
  drawer.classList.toggle('open');
  e.stopPropagation();
});


