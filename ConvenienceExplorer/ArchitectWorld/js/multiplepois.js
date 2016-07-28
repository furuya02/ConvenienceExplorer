var World = {
	markerDrawable_idle: null,
    imageSeveneleven: null,
    imageLowson: null,
    imageFamilymart: null,
    imageSeicomart: null,
};

function createData(json){
    var data = JSON.parse(json);

    World.markerDrawable_idle = new AR.ImageResource("assets/marker.png");
    World.imageSeveneleven = new AR.ImageResource("assets/seveneleven.jpg");
    World.imageLowson = new AR.ImageResource("assets/lowson.png");
    World.imageFamilymart = new AR.ImageResource("assets/familymart.jpg");
    World.imageSeicomart = new AR.ImageResource("assets/seicomart.jpeg");
    World.imageSanks = new AR.ImageResource("assets/sanks.jpeg");

    for (var i = 0; i < data.convenienceStores.length; i++) {
        var singlePoi = {
            "latitude": parseFloat(data.convenienceStores[i].latitude),
            "longitude": parseFloat(data.convenienceStores[i].longitude),
            "altitude": parseFloat(data.convenienceStores[i].altitude + Math.floor(Math.random() * 5) * 20),
            "grouping": data.convenienceStores[i].grouping,
            "name": data.convenienceStores[i].name,
            "distance": data.convenienceStores[i].distance
        };
        new Marker(singlePoi);
    }
}

function clearData(){
    AR.context.destroyAll();
}
