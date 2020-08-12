var queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson';

var map = L.map('map', {
    center: [37.09, -95.71],
    zoom: 5,
});

var streetsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.streets-basic",
    accessToken: 'pk.eyJ1Ijoib2xpdmVyZ3UiLCJhIjoiY2tkOWxpdzRoMGtmZzJ1bWt0ODdrOGZpNSJ9.2g-nnC87LyBB1C1WQ2IqDw' 
}).addTo(map);

var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: 'pk.eyJ1Ijoib2xpdmVyZ3UiLCJhIjoiY2tkOWxpdzRoMGtmZzJ1bWt0ODdrOGZpNSJ9.2g-nnC87LyBB1C1WQ2IqDw'
}).addTo(map);;


function Scale(mag) {
    switch(true) {
        case mag < 1:
            return '#CCFF43';
            break;
        case mag < 2:
            return '#FFFF33';
            break;
        case mag < 3:
            return '#FFCC53';
            break;
        case mag < 4:
            return '#FF9733';
            break;
        case mag < 5:
            return '#FF6833';
            break;
        default:
            return '#FF6666';
    }
}

    d3.json(queryURL, data => {
    console.log(data.features);



    //L.geoJson(data, {
        //pointToLayer: function(feature, latlng) {
           // return L.circleMarker(latlng);
        //},
        //style: styleInfo,
        //onEachFeature: function(feature, layer) {
            //bindPopup("Magnitude: " + d.properties.mag
                       // + "<br>Location: " + d.properties.place);
        //}
    //});

    data.features.forEach(d => {
        L.circleMarker([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
            fillOpacity: 1,
            color: 'green',
            weight: 4,
            fillColor: Scale(d.properties.mag),
            radius: d.properties.mag * 7
        }).bindPopup("Magnitude: " + d.properties.mag + "<br>Location: " + d.properties.place).addTo(map);
    });
    
    var legend = L.control({ position: 'topright'});

    legend.onAdd = function() {

        var def = L.DomUtil.create('div', 'info legend');

        var limits = [0, 1, 2, 3, 4, 5, 6];
        
        limits.forEach((l, i) => {
            def.innerHTML +=  '<i style="background-color:' + Scale(l) + '"></i> '
            + l + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        });
        return def;
    };
    legend.addTo(map);
});