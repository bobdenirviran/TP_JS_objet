class Marker {

    constructor( map, position, description ){
        this.g_marker = null;
        this.g_infowindow = null;
        this.createG_marker( map, position, description);
        this.createG_infowindow( description );

        this.linkMarkerWindow();
    }
    createG_marker( map, position, description ){
        this.g_marker = new google.maps.Marker({
            map: map,
            position: position,
            description: description
        });
    }
    createG_infowindow( description ) {
        let content = "<h3>" + description + "</h3>";
        this.g_infowindow = new google.maps.InfoWindow({
            content: content
        })

    }
    linkMarkerWindow(){
        this.g_marker.addListener("click", () => {
            this.g_infowindow.open( this.g_marker.getMap(), this.g_marker );
        });
    }
}
module.exports = Marker;