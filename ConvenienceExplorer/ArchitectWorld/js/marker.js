function Marker(poiData) {

    /*
        For creating the marker a new object AR.GeoObject will be created at the specified geolocation. An AR.GeoObject connects one or more AR.GeoLocations with multiple AR.Drawables. The AR.Drawables can be defined for multiple targets. A target can be the camera, the radar or a direction indicator. Both the radar and direction indicators will be covered in more detail in later examples.
    */

    this.poiData = poiData;

    // create the AR.GeoLocation from the poi data
    var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);

    // create an AR.ImageDrawable for the marker in idle state
    this.markerDrawable_idle = new AR.ImageDrawable(World.markerDrawable_idle, 2.5, {
        zOrder: 0,
        opacity: 1.0,
        /*
            To react on user interaction, an onClick property can be set for each AR.Drawable. The property is a function which will be called each time the user taps on the drawable. The function called on each tap is returned from the following helper function defined in marker.js. The function returns a function which checks the selected state with the help of the variable isSelected and executes the appropriate function. The clicked marker is passed as an argument.
        */
        onClick: Marker.prototype.getOnClickTrigger(this)
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



    // create an AR.Label for the marker's title 
    this.titleLabel = new AR.Label(poiData.title.trunc(10), 0.4, {
        zOrder: 1,
        offsetY: -0.8,
        style: {
            textColor: '#FFFFFF'
        }
    });

    // create an AR.Label for the marker's description
    this.descriptionLabel = new AR.Label(poiData.distance.trunc(15), 1.0, {
        zOrder: 1,
        offsetY: 0.4,
        offsetX: 0.5,
        style: {
            textColor: '#FFFF00',
            fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
    });

    // create the AR.GeoObject with the drawable objects
    this.markerObject = new AR.GeoObject(markerLocation, {
        drawables: {
            cam: [this.markerDrawable_idle, this.titleLabel, this.descriptionLabel, this.imageSeveneleven, this.imageLowson, this.imageFamirymart,this.imageSeicomart, this.imageSanks]
        }
    });

    return this;
}

Marker.prototype.getOnClickTrigger = function(marker) {

    /*
        The setSelected and setDeselected functions are prototype Marker functions.

        Both functions perform the same steps but inverted, hence only one function (setSelected) is covered in detail. Three steps are necessary to select the marker. First the state will be set appropriately. Second the background drawable will be enabled and the standard background disabled. This is done by setting the opacity property to 1.0 for the visible state and to 0.0 for an invisible state. Third the onClick function is set only for the background drawable of the selected marker.
    */

    return function() {

        if (marker.isSelected) {

            Marker.prototype.setDeselected(marker);

        } else {
            Marker.prototype.setSelected(marker);
            try {
                World.onMarkerSelected(marker);
            } catch (err) {
                alert(err);
            }

        }

        return true;
    };
};

Marker.prototype.setSelected = function(marker) {

    marker.isSelected = true;

    marker.markerDrawable_idle.opacity = 0.0;
    marker.markerDrawable_selected.opacity = 1.0;
    marker.markerDrawable_idle.onClick = null;
    marker.markerDrawable_selected.onClick = Marker.prototype.getOnClickTrigger(marker);
};

Marker.prototype.setDeselected = function(marker) {

    marker.isSelected = false;

    marker.markerDrawable_idle.opacity = 1.0;
    marker.markerDrawable_selected.opacity = 0.0;

    marker.markerDrawable_idle.onClick = Marker.prototype.getOnClickTrigger(marker);
    marker.markerDrawable_selected.onClick = null;
};

// will truncate all strings longer than given max-length "n". e.g. "foobar".trunc(3) -> "foo..."
String.prototype.trunc = function(n) {
    return this.substr(0, n - 1) + (this.length > n ? '...' : '');
};