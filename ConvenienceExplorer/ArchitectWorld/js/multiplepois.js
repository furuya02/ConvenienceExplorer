var World = {
	markerDrawable_idle: null,
    imageSeveneleven: null,
    imageLowson: null,
    imageFamilymart: null,
    imageSeicomart: null,


    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

		for (var i = 0; i < poiData.length; i++) {
			var singlePoi = {
				"latitude": parseFloat(poiData[i].latitude),
				"longitude": parseFloat(poiData[i].longitude),
				"altitude": parseFloat(poiData[i].altitude),
                "grouping": poiData[i].grouping,
				"name": poiData[i].name,
				"distance": poiData[i].distance
			};
            new Marker(singlePoi);
		}
	}
};

function newData(json){
    var data = JSON.parse(json);

    World.markerDrawable_idle = new AR.ImageResource("assets/marker.png");
    World.imageSeveneleven = new AR.ImageResource("assets/seveneleven.jpg");
    World.imageLowson = new AR.ImageResource("assets/lowson.png");
    World.imageFamilymart = new AR.ImageResource("assets/familymart.jpg");
    World.imageSeicomart = new AR.ImageResource("assets/seicomart.jpeg");
    World.imageSanks = new AR.ImageResource("assets/sanks.jpeg");

    var poiData = [];
    for (var i = 0; i < data.convenienceStores.length; i++) {
        poiData.push({
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
