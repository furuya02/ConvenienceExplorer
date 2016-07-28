var World = {
	markerDrawable_idle: null,
    imageSeveneleven: null,
    imageLowson: null,
    imageFamilymart: null,
    imageSeicomart: null,

	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
		World.markerDrawable_idle = new AR.ImageResource("assets/marker.png");
        World.imageSeveneleven = new AR.ImageResource("assets/seveneleven.jpg");
        World.imageLowson = new AR.ImageResource("assets/lowson.png");
        World.imageFamilymart = new AR.ImageResource("assets/familymart.jpg");
        World.imageSeicomart = new AR.ImageResource("assets/seicomart.jpeg");
        World.imageSanks = new AR.ImageResource("assets/sanks.jpeg");

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
            new Marker(singlePoi);
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
}
