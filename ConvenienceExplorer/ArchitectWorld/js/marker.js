function Marker(poiData) {

    this.poiData = poiData;
    var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);
    this.markerDrawable_idle = new AR.ImageDrawable(World.markerDrawable_idle, 2.5, {
        zOrder: 0,
        opacity: 1.0
    });

    this.imageSeveneleven = new AR.ImageDrawable(World.imageSeveneleven, 2.0, {
                                                        zOrder: 1,
                                                        opacity: poiData.grouping==4?1:0,
                                                        offsetY: 0.35,
                                                        offsetX: -2.0
                                                        });
    this.imageLowson = new AR.ImageDrawable(World.imageLowson, 2.0, {
                                                 zOrder: 1,
                                                opacity: poiData.grouping==2?1:0,
                                                 offsetY: 0.35,
                                                 offsetX: -2.0
                                                 });
    this.imageFamirymart = new AR.ImageDrawable(World.imageFamilymart, 2.0, {
                                                 zOrder: 1,
                                                opacity: poiData.grouping==1?1:0,
                                                 offsetY: 0.35,
                                                 offsetX: -2.0
                                                 });
    this.imageSeicomart = new AR.ImageDrawable(World.imageSeicomart, 2.0, {
                                                 zOrder: 1,
                                               opacity: poiData.grouping==3?1:0,
                                                 offsetY: 0.35,
                                                 offsetX: -2.0
                                                 });
    this.imageSanks = new AR.ImageDrawable(World.imageSanks, 2.0, {
                                               zOrder: 1,
                                               opacity: poiData.grouping==5?1:0,
                                               offsetY: 0.35,
                                               offsetX: -2.0
                                               });
    this.nameLabel = new AR.Label(poiData.name.trunc(10), 0.4, {
        zOrder: 1,
        offsetY: -0.8,
        style: {
            textColor: '#FFFFFF'
        }
    });
    this.distanceLabel = new AR.Label(poiData.distance.trunc(15), 1.0, {
        zOrder: 1,
        offsetY: 0.4,
        offsetX: 0.5,
        style: {
            textColor: '#FFFF00',
            fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
    });
    this.markerObject = new AR.GeoObject(markerLocation, {
        drawables: {
            cam: [this.markerDrawable_idle, this.nameLabel, this.distanceLabel, this.imageSeveneleven, this.imageLowson, this.imageFamirymart,this.imageSeicomart, this.imageSanks]
        }
    });

    return this;
}

String.prototype.trunc = function(n) {
    return this.substr(0, n - 1) + (this.length > n ? '...' : '');
};