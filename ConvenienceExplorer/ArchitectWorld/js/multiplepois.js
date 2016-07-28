//var convenienceStores;
//var keep_lat;
//var keep_lon;
// implementation of AR-Experience (aka "World")
var World = {
	// true once data was fetched
	initiallyLoadedData: false,

	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_selected: null,
    imageSeveneleven: null,
    imageLowson: null,
    imageFamilymart: null,
    imageSeicomart: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

        // empty list of visible markers
		World.markerList = [];

		// start loading marker assets
		World.markerDrawable_idle = new AR.ImageResource("assets/marker.png");
        World.imageSeveneleven = new AR.ImageResource("assets/seveneleven.jpg");
        World.imageLowson = new AR.ImageResource("assets/lowson.png");
        World.imageFamilymart = new AR.ImageResource("assets/familymart.jpg");
        World.imageSeicomart = new AR.ImageResource("assets/seicomart.jpeg");
        World.imageSanks = new AR.ImageResource("assets/sanks.jpeg");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			var singlePoi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
                "grouping": poiData[currentPlaceNr].grouping,
				"name": poiData[currentPlaceNr].name,
				"distance": poiData[currentPlaceNr].distance
			};

			/*
				To be able to deselect a marker while the user taps on the empty screen, 
				the World object holds an array that contains each marker.
			*/
			World.markerList.push(new Marker(singlePoi));
		}

		World.updateStatusMessage(currentPlaceNr + ' places loaded');
	},

	// updates status message shon in small "i"-button aligned bottom center
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {

		/*
			The custom function World.onLocationChanged checks with the flag World.initiallyLoadedData if the function was already called. With the first call of World.onLocationChanged an object that contains geo information will be created which will be later used to create a marker using the World.loadPoisFromJsonData function.
		*/
//        keep_lat = lat;
//        keep_lon = lon;


		if (!World.initiallyLoadedData) {
			/* 
				requestDataFromLocal with the geo information as parameters (latitude, longitude) creates different poi data to a random location in the user's vicinity.
			*/
//			World.requestDataFromLocal(lat, lon);
			World.initiallyLoadedData = true;
		}
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {

		// deselect previous marker
		if (World.currentMarker) {
			if (World.currentMarker.poiData.id == marker.poiData.id) {
				return;
			}
			World.currentMarker.setDeselected(World.currentMarker);
		}

		// highlight current one
		marker.setSelected(marker);
		World.currentMarker = marker;
	},

	// screen was clicked but no geo-object was hit
	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
	},
};

function newData(json){
    var data = JSON.parse(json);
    var poisToCreate = data.convenienceStores.length;
    var poiData = [];
    for (var i = 0; i < poisToCreate; i++) {
        poiData.push({
                     "id": (i + 1),
                     "longitude": (data.convenienceStores[i].longitude),
                     "latitude": (data.convenienceStores[i].latitude),
                     "distance": (data.convenienceStores[i].distance),
                     "grouping": (data.convenienceStores[i].grouping),
                     "altitude": (data.convenienceStores[i].altitude + Math.floor(Math.random() * 5) * 20),
                     "name": (data.convenienceStores[i].name)
                     });
    }
    World.loadPoisFromJsonData(poiData);
}

function clearData(){
    AR.context.destroyAll();
    World.markerList = [];
}


/*
	Set a custom function where location changes are forwarded to. There is also a possibility to set AR.context.onLocationChanged to null. In this case the function will not be called anymore and no further location updates will be received.
*/
AR.context.onLocationChanged = World.locationChanged;

/*
	To detect clicks where no drawable was hit set a custom function on AR.context.onScreenClick where the currently selected marker is deselected.
*/
AR.context.onScreenClick = World.onScreenClick;
