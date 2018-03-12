(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Marker = require("./Marker");
class App {
    constructor() {

        this.$form_shop     = document.getElementById("form-shop");
        this.$form_seller   = document.getElementById("form-seller");
        this.$form_product  = document.getElementById("form-product");
        this.$denomination  = document.getElementById("denomination");
        this.$latitude      = document.getElementById("latitude");
        this.$longitude     = document.getElementById("longitude");
        this.$name          = document.getElementById("name");
        this.$surname       = document.getElementById("surname");
        this.$shop_seller   = document.getElementById("shop_seller");
        this.$label         = document.getElementById("label");
        this.$price         = document.getElementById("price");
        this.$image         = document.getElementById("image");
        this.$shop_product  = document.getElementById("shop_product");

        this.shops = [];

        this.position = {
            lat:0,
            lng:0
        };

        this.map = null;

        this.mapMarker = null;
    }

    setPosition(lat,lng)
    {
        this.position.lat = lat;
        this.position.lng = lng;
        this.centerOnAppPosition()
        this.setAppMarker()
    }

    centerOnAppPosition() // centre sur la position actuelle 
    {
        this.map.setCenter({
            lat: this.position.lat,
            lng: this.position.lng
        });
    }

    initMap(idElement)
    {
        this.map = new google.maps.Map(document.getElementById(idElement),{
            center: {
                lat: 42.68269804218056,
                lng: 2.7930930484525334
            },
            zoom: 16 // zoom max 22
        });
    }

    setAppMarker()
    {
        // const infowindow = new google.maps.InfoWindow({
        //     content: "<h3>Vous etes ici</h3>"
        // });
        this.appMarker = new google.maps.Marker({
            position: this.position,
            map: this.map,
            title: "ici"
        });        
        this.appMarker.addListener("click", () => {
            infowindow.open( this.map, this.appMarker);
        });
    }

    addMarker()
    {
        const position = {
            lat: parseFloat(this.$latitude.value),
            lng: parseFloat(this.$longitude.value)
        }
        const marker = new Marker(
            this.map,
            position,
            this.$denomination.value
        );
    }

    clearForm(){
        this.$form_shop.reset();
        this.$form_seller.reset();
        this.$form_product.reset();
    }

    getShopByDenomination( value ) {
        if(this.shops.length)
        {
            for(let mag of this.shops) 
            {
                if(value == mag.denomination)
                {
                    return mag;
                }
            }  
        }
    }

    addShop( shop ) {
        this.shops.push( shop );
        save( this.shops );
    }

    saveDataShop( shops ) {
        if(typeof localStorage!='undefined') {
            localStorage.setItem('Shop',JSON.stringify(this.shops));
            console.log("Magasin enregistré");
        } else {
            alert("localStorage n'est pas supporté");
        };
    }

    LoadDataShop(){
        this.shops = [];
        var array =[];
        var flag_shop = "";
        var flag_seller = "";
        var flag_product = "";
        if( localStorage.getItem('Shop') ) {
            array = JSON.parse(localStorage.getItem('Shop'));
            console.log("Chargement effectué");
            if(array.length)
            {
                for(let mag of array) 
                {
                    if(flagshop != mag.denomination ) 
                    { 
                        let position = { lat: parseFloat(mag.latitude), lng: parseFloat(mag.longitude) };
                        const marker = new Marker( this.map, position, mag.denomination);
                        this.shops.push( new Shop( mag.denomination, mag.latitude, mag.longitude ) );
                        // creation de la boite à liste                    
                        let mag1 = document.createElement('option');
                        mag1.innerText = mag.denomination;
                        shop_seller.appendChild(mag1);
                        let mag2 = document.createElement('option');
                        mag2.innerText = mag.denomination;
                        shop_product.appendChild(mag2);
                        if( flag_seller != mag.name ) 
                        {
                            shop.sellers.push( new Sellers(mag.name, mag.surname, mag.shop_seller) );
                            flagseller = mag.name
                        }
                        if( flag_product != mag.label)
                        {
                            shop.products.push( new Products(mag.label, mag.price, mag.image, mag.magasin));
                            flag_product = mag.magasin;
                        } 
                    }
                }  
            }
        } else {
            alert("localStorage n'est pas supporté");
        };
        return This.shops;
    }
}

module.exports = App; // exporte la classe sinon mettre pour exporter une instance
},{"./Marker":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
class Product {

    constructor( label, price, image, magasin = [] ) {

        this.label          = label;
        this.price          = price;
        this.image          = image;
        this.shop_product   = magasin;

    }
}
module.exports = Product;
},{}],4:[function(require,module,exports){
class Seller {

    constructor(name, surname, magasin) {

        this.name       = name;
        this.surname    = surname;
        this.shop_seller= magasin;

    }
}
module.exports = Seller;
},{}],5:[function(require,module,exports){
const App = require("./App");
const Seller = require("./Seller");
const Product = require("./Product");
class Shop {

    constructor( denomination, latitude,  longitude) {

        this.denomination = denomination;
        this.latitude     = latitude;
        this.longitude    = longitude;

        this.sellers = [];
        this.products = [];

    }

    addSeller( seller ) {

        this.sellers.push( seller );
    }

    addProduct( product ) {

        this.products.push( product );
    }
}

module.exports = Shop;
},{"./App":1,"./Product":3,"./Seller":4}],6:[function(require,module,exports){
const GoogleMapsLoader = require('google-maps'),
// require de la classe ou de l'instance
App = require("./class/App"); 
Shop = require("./class/Shop");
Seller = require("./class/Seller");
Product = require("./class/Product");
GoogleMapsLoader.KEY = "AIzaSyD_DW3uaJrBKyD8jEaX5BvcwxsnswxO2oE";
GoogleMapsLoader.load(function()
{
    const app = new App();
    app.initMap("map");
    app.loadDataShop();

    app.$form_shop.onsubmit = function(){
        event.preventDefault();
        app.addMarker();
        const shop = new Shop( app.$denomination.value, app.$latitude.value, app.$longitude.value ) ;
        app.addShop( shop );
    }

    app.$form_seller.onsubmit = function(){
        event.preventDefault();
        const seller = new Seller(app.$name.value, app.$surname.value, app.$shop_seller.value);
        let value = app.$shop_seller.value;
        const shop = app.getShopByDenomination( value );
        shop.addSeller( seller );
        app.saveDataShop();
    }

    app.$form_product.onsubmit = function(){
        event.preventDefault();
        const product = new Product(app.$label.value, app.$price.value, app.$image.value, app.$shop_product.value);
        let value = app.$shop_product.value;
        console.log(value);
        const product = app.getShopByDenomination( value );
        shop.addProduct( product );
        app.saveDataShop();
    }

    app.map.addListener("click", function(event){
        app.$latitude.value = event.latLng.lat();
        app.$longitude.value = event.latLng.lng();
    });
});
},{"./class/App":1,"./class/Product":3,"./class/Seller":4,"./class/Shop":5,"google-maps":7}],7:[function(require,module,exports){
(function(root, factory) {

	if (root === null) {
		throw new Error('Google-maps package can be used only in browser');
	}

	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.GoogleMapsLoader = factory();
	}

})(typeof window !== 'undefined' ? window : null, function() {


	'use strict';


	var googleVersion = '3.18';

	var script = null;

	var google = null;

	var loading = false;

	var callbacks = [];

	var onLoadEvents = [];

	var originalCreateLoaderMethod = null;


	var GoogleMapsLoader = {};


	GoogleMapsLoader.URL = 'https://maps.googleapis.com/maps/api/js';

	GoogleMapsLoader.KEY = null;

	GoogleMapsLoader.LIBRARIES = [];

	GoogleMapsLoader.CLIENT = null;

	GoogleMapsLoader.CHANNEL = null;

	GoogleMapsLoader.LANGUAGE = null;

	GoogleMapsLoader.REGION = null;

	GoogleMapsLoader.VERSION = googleVersion;

	GoogleMapsLoader.WINDOW_CALLBACK_NAME = '__google_maps_api_provider_initializator__';


	GoogleMapsLoader._googleMockApiObject = {};


	GoogleMapsLoader.load = function(fn) {
		if (google === null) {
			if (loading === true) {
				if (fn) {
					callbacks.push(fn);
				}
			} else {
				loading = true;

				window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] = function() {
					ready(fn);
				};

				GoogleMapsLoader.createLoader();
			}
		} else if (fn) {
			fn(google);
		}
	};


	GoogleMapsLoader.createLoader = function() {
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = GoogleMapsLoader.createUrl();

		document.body.appendChild(script);
	};


	GoogleMapsLoader.isLoaded = function() {
		return google !== null;
	};


	GoogleMapsLoader.createUrl = function() {
		var url = GoogleMapsLoader.URL;

		url += '?callback=' + GoogleMapsLoader.WINDOW_CALLBACK_NAME;

		if (GoogleMapsLoader.KEY) {
			url += '&key=' + GoogleMapsLoader.KEY;
		}

		if (GoogleMapsLoader.LIBRARIES.length > 0) {
			url += '&libraries=' + GoogleMapsLoader.LIBRARIES.join(',');
		}

		if (GoogleMapsLoader.CLIENT) {
			url += '&client=' + GoogleMapsLoader.CLIENT + '&v=' + GoogleMapsLoader.VERSION;
		}

		if (GoogleMapsLoader.CHANNEL) {
			url += '&channel=' + GoogleMapsLoader.CHANNEL;
		}

		if (GoogleMapsLoader.LANGUAGE) {
			url += '&language=' + GoogleMapsLoader.LANGUAGE;
		}

		if (GoogleMapsLoader.REGION) {
			url += '&region=' + GoogleMapsLoader.REGION;
		}

		return url;
	};


	GoogleMapsLoader.release = function(fn) {
		var release = function() {
			GoogleMapsLoader.KEY = null;
			GoogleMapsLoader.LIBRARIES = [];
			GoogleMapsLoader.CLIENT = null;
			GoogleMapsLoader.CHANNEL = null;
			GoogleMapsLoader.LANGUAGE = null;
			GoogleMapsLoader.REGION = null;
			GoogleMapsLoader.VERSION = googleVersion;

			google = null;
			loading = false;
			callbacks = [];
			onLoadEvents = [];

			if (typeof window.google !== 'undefined') {
				delete window.google;
			}

			if (typeof window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] !== 'undefined') {
				delete window[GoogleMapsLoader.WINDOW_CALLBACK_NAME];
			}

			if (originalCreateLoaderMethod !== null) {
				GoogleMapsLoader.createLoader = originalCreateLoaderMethod;
				originalCreateLoaderMethod = null;
			}

			if (script !== null) {
				script.parentElement.removeChild(script);
				script = null;
			}

			if (fn) {
				fn();
			}
		};

		if (loading) {
			GoogleMapsLoader.load(function() {
				release();
			});
		} else {
			release();
		}
	};


	GoogleMapsLoader.onLoad = function(fn) {
		onLoadEvents.push(fn);
	};


	GoogleMapsLoader.makeMock = function() {
		originalCreateLoaderMethod = GoogleMapsLoader.createLoader;

		GoogleMapsLoader.createLoader = function() {
			window.google = GoogleMapsLoader._googleMockApiObject;
			window[GoogleMapsLoader.WINDOW_CALLBACK_NAME]();
		};
	};


	var ready = function(fn) {
		var i;

		loading = false;

		if (google === null) {
			google = window.google;
		}

		for (i = 0; i < onLoadEvents.length; i++) {
			onLoadEvents[i](google);
		}

		if (fn) {
			fn(google);
		}

		for (i = 0; i < callbacks.length; i++) {
			callbacks[i](google);
		}

		callbacks = [];
	};


	return GoogleMapsLoader;

});

},{}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJGOi9KU19vYmpldC9UUC9qcy9jbGFzcy9BcHAuanMiLCJGOi9KU19vYmpldC9UUC9qcy9jbGFzcy9NYXJrZXIuanMiLCJGOi9KU19vYmpldC9UUC9qcy9jbGFzcy9Qcm9kdWN0LmpzIiwiRjovSlNfb2JqZXQvVFAvanMvY2xhc3MvU2VsbGVyLmpzIiwiRjovSlNfb2JqZXQvVFAvanMvY2xhc3MvU2hvcC5qcyIsIkY6L0pTX29iamV0L1RQL2pzL21haW4uanMiLCJGOi9KU19vYmpldC9UUC9ub2RlX21vZHVsZXMvZ29vZ2xlLW1hcHMvbGliL0dvb2dsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgTWFya2VyID0gcmVxdWlyZShcIi4vTWFya2VyXCIpO1xyXG5jbGFzcyBBcHAge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJGZvcm1fc2hvcCAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcm0tc2hvcFwiKTtcclxuICAgICAgICB0aGlzLiRmb3JtX3NlbGxlciAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLXNlbGxlclwiKTtcclxuICAgICAgICB0aGlzLiRmb3JtX3Byb2R1Y3QgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLXByb2R1Y3RcIik7XHJcbiAgICAgICAgdGhpcy4kZGVub21pbmF0aW9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVub21pbmF0aW9uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhdGl0dWRlICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdGl0dWRlXCIpO1xyXG4gICAgICAgIHRoaXMuJGxvbmdpdHVkZSAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvbmdpdHVkZVwiKTtcclxuICAgICAgICB0aGlzLiRuYW1lICAgICAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpO1xyXG4gICAgICAgIHRoaXMuJHN1cm5hbWUgICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1cm5hbWVcIik7XHJcbiAgICAgICAgdGhpcy4kc2hvcF9zZWxsZXIgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvcF9zZWxsZXJcIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWwgICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGFiZWxcIik7XHJcbiAgICAgICAgdGhpcy4kcHJpY2UgICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpY2VcIik7XHJcbiAgICAgICAgdGhpcy4kaW1hZ2UgICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1hZ2VcIik7XHJcbiAgICAgICAgdGhpcy4kc2hvcF9wcm9kdWN0ICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvcF9wcm9kdWN0XCIpO1xyXG5cclxuICAgICAgICB0aGlzLnNob3BzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgIGxhdDowLFxyXG4gICAgICAgICAgICBsbmc6MFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubWFwID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5tYXBNYXJrZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBvc2l0aW9uKGxhdCxsbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi5sYXQgPSBsYXQ7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi5sbmcgPSBsbmc7XHJcbiAgICAgICAgdGhpcy5jZW50ZXJPbkFwcFBvc2l0aW9uKClcclxuICAgICAgICB0aGlzLnNldEFwcE1hcmtlcigpXHJcbiAgICB9XHJcblxyXG4gICAgY2VudGVyT25BcHBQb3NpdGlvbigpIC8vIGNlbnRyZSBzdXIgbGEgcG9zaXRpb24gYWN0dWVsbGUgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0Q2VudGVyKHtcclxuICAgICAgICAgICAgbGF0OiB0aGlzLnBvc2l0aW9uLmxhdCxcclxuICAgICAgICAgICAgbG5nOiB0aGlzLnBvc2l0aW9uLmxuZ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRNYXAoaWRFbGVtZW50KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEVsZW1lbnQpLHtcclxuICAgICAgICAgICAgY2VudGVyOiB7XHJcbiAgICAgICAgICAgICAgICBsYXQ6IDQyLjY4MjY5ODA0MjE4MDU2LFxyXG4gICAgICAgICAgICAgICAgbG5nOiAyLjc5MzA5MzA0ODQ1MjUzMzRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgem9vbTogMTYgLy8gem9vbSBtYXggMjJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBcHBNYXJrZXIoKVxyXG4gICAge1xyXG4gICAgICAgIC8vIGNvbnN0IGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgLy8gICAgIGNvbnRlbnQ6IFwiPGgzPlZvdXMgZXRlcyBpY2k8L2gzPlwiXHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgdGhpcy5hcHBNYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24sXHJcbiAgICAgICAgICAgIG1hcDogdGhpcy5tYXAsXHJcbiAgICAgICAgICAgIHRpdGxlOiBcImljaVwiXHJcbiAgICAgICAgfSk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmFwcE1hcmtlci5hZGRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgaW5mb3dpbmRvdy5vcGVuKCB0aGlzLm1hcCwgdGhpcy5hcHBNYXJrZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE1hcmtlcigpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgIGxhdDogcGFyc2VGbG9hdCh0aGlzLiRsYXRpdHVkZS52YWx1ZSksXHJcbiAgICAgICAgICAgIGxuZzogcGFyc2VGbG9hdCh0aGlzLiRsb25naXR1ZGUudmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IG5ldyBNYXJrZXIoXHJcbiAgICAgICAgICAgIHRoaXMubWFwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbixcclxuICAgICAgICAgICAgdGhpcy4kZGVub21pbmF0aW9uLnZhbHVlXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckZvcm0oKXtcclxuICAgICAgICB0aGlzLiRmb3JtX3Nob3AucmVzZXQoKTtcclxuICAgICAgICB0aGlzLiRmb3JtX3NlbGxlci5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMuJGZvcm1fcHJvZHVjdC5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNob3BCeURlbm9taW5hdGlvbiggdmFsdWUgKSB7XHJcbiAgICAgICAgaWYodGhpcy5zaG9wcy5sZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IG1hZyBvZiB0aGlzLnNob3BzKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodmFsdWUgPT0gbWFnLmRlbm9taW5hdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkU2hvcCggc2hvcCApIHtcclxuICAgICAgICB0aGlzLnNob3BzLnB1c2goIHNob3AgKTtcclxuICAgICAgICBzYXZlKCB0aGlzLnNob3BzICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZURhdGFTaG9wKCBzaG9wcyApIHtcclxuICAgICAgICBpZih0eXBlb2YgbG9jYWxTdG9yYWdlIT0ndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnU2hvcCcsSlNPTi5zdHJpbmdpZnkodGhpcy5zaG9wcykpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1hZ2FzaW4gZW5yZWdpc3Ryw6lcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJsb2NhbFN0b3JhZ2Ugbidlc3QgcGFzIHN1cHBvcnTDqVwiKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIExvYWREYXRhU2hvcCgpe1xyXG4gICAgICAgIHRoaXMuc2hvcHMgPSBbXTtcclxuICAgICAgICB2YXIgYXJyYXkgPVtdO1xyXG4gICAgICAgIHZhciBmbGFnX3Nob3AgPSBcIlwiO1xyXG4gICAgICAgIHZhciBmbGFnX3NlbGxlciA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGZsYWdfcHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgaWYoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdTaG9wJykgKSB7XHJcbiAgICAgICAgICAgIGFycmF5ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnU2hvcCcpKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGFyZ2VtZW50IGVmZmVjdHXDqVwiKTtcclxuICAgICAgICAgICAgaWYoYXJyYXkubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IG1hZyBvZiBhcnJheSkgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZmxhZ3Nob3AgIT0gbWFnLmRlbm9taW5hdGlvbiApIFxyXG4gICAgICAgICAgICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IHsgbGF0OiBwYXJzZUZsb2F0KG1hZy5sYXRpdHVkZSksIGxuZzogcGFyc2VGbG9hdChtYWcubG9uZ2l0dWRlKSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBuZXcgTWFya2VyKCB0aGlzLm1hcCwgcG9zaXRpb24sIG1hZy5kZW5vbWluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3BzLnB1c2goIG5ldyBTaG9wKCBtYWcuZGVub21pbmF0aW9uLCBtYWcubGF0aXR1ZGUsIG1hZy5sb25naXR1ZGUgKSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGlvbiBkZSBsYSBib2l0ZSDDoCBsaXN0ZSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtYWcxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hZzEuaW5uZXJUZXh0ID0gbWFnLmRlbm9taW5hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvcF9zZWxsZXIuYXBwZW5kQ2hpbGQobWFnMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtYWcyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hZzIuaW5uZXJUZXh0ID0gbWFnLmRlbm9taW5hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvcF9wcm9kdWN0LmFwcGVuZENoaWxkKG1hZzIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggZmxhZ19zZWxsZXIgIT0gbWFnLm5hbWUgKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvcC5zZWxsZXJzLnB1c2goIG5ldyBTZWxsZXJzKG1hZy5uYW1lLCBtYWcuc3VybmFtZSwgbWFnLnNob3Bfc2VsbGVyKSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ3NlbGxlciA9IG1hZy5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGZsYWdfcHJvZHVjdCAhPSBtYWcubGFiZWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3AucHJvZHVjdHMucHVzaCggbmV3IFByb2R1Y3RzKG1hZy5sYWJlbCwgbWFnLnByaWNlLCBtYWcuaW1hZ2UsIG1hZy5tYWdhc2luKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX3Byb2R1Y3QgPSBtYWcubWFnYXNpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwibG9jYWxTdG9yYWdlIG4nZXN0IHBhcyBzdXBwb3J0w6lcIik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gVGhpcy5zaG9wcztcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHA7IC8vIGV4cG9ydGUgbGEgY2xhc3NlIHNpbm9uIG1ldHRyZSBwb3VyIGV4cG9ydGVyIHVuZSBpbnN0YW5jZSIsImNsYXNzIE1hcmtlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoIG1hcCwgcG9zaXRpb24sIGRlc2NyaXB0aW9uICl7XHJcbiAgICAgICAgdGhpcy5nX21hcmtlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5nX2luZm93aW5kb3cgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlR19tYXJrZXIoIG1hcCwgcG9zaXRpb24sIGRlc2NyaXB0aW9uKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUdfaW5mb3dpbmRvdyggZGVzY3JpcHRpb24gKTtcclxuXHJcbiAgICAgICAgdGhpcy5saW5rTWFya2VyV2luZG93KCk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVHX21hcmtlciggbWFwLCBwb3NpdGlvbiwgZGVzY3JpcHRpb24gKXtcclxuICAgICAgICB0aGlzLmdfbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgIG1hcDogbWFwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlR19pbmZvd2luZG93KCBkZXNjcmlwdGlvbiApIHtcclxuICAgICAgICBsZXQgY29udGVudCA9IFwiPGgzPlwiICsgZGVzY3JpcHRpb24gKyBcIjwvaDM+XCI7XHJcbiAgICAgICAgdGhpcy5nX2luZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuICAgIGxpbmtNYXJrZXJXaW5kb3coKXtcclxuICAgICAgICB0aGlzLmdfbWFya2VyLmFkZExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdfaW5mb3dpbmRvdy5vcGVuKCB0aGlzLmdfbWFya2VyLmdldE1hcCgpLCB0aGlzLmdfbWFya2VyICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNYXJrZXI7IiwiY2xhc3MgUHJvZHVjdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoIGxhYmVsLCBwcmljZSwgaW1hZ2UsIG1hZ2FzaW4gPSBbXSApIHtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJlbCAgICAgICAgICA9IGxhYmVsO1xyXG4gICAgICAgIHRoaXMucHJpY2UgICAgICAgICAgPSBwcmljZTtcclxuICAgICAgICB0aGlzLmltYWdlICAgICAgICAgID0gaW1hZ2U7XHJcbiAgICAgICAgdGhpcy5zaG9wX3Byb2R1Y3QgICA9IG1hZ2FzaW47XHJcblxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gUHJvZHVjdDsiLCJjbGFzcyBTZWxsZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHN1cm5hbWUsIG1hZ2FzaW4pIHtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lICAgICAgID0gbmFtZTtcclxuICAgICAgICB0aGlzLnN1cm5hbWUgICAgPSBzdXJuYW1lO1xyXG4gICAgICAgIHRoaXMuc2hvcF9zZWxsZXI9IG1hZ2FzaW47XHJcblxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2VsbGVyOyIsImNvbnN0IEFwcCA9IHJlcXVpcmUoXCIuL0FwcFwiKTtcclxuY29uc3QgU2VsbGVyID0gcmVxdWlyZShcIi4vU2VsbGVyXCIpO1xyXG5jb25zdCBQcm9kdWN0ID0gcmVxdWlyZShcIi4vUHJvZHVjdFwiKTtcclxuY2xhc3MgU2hvcCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoIGRlbm9taW5hdGlvbiwgbGF0aXR1ZGUsICBsb25naXR1ZGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kZW5vbWluYXRpb24gPSBkZW5vbWluYXRpb247XHJcbiAgICAgICAgdGhpcy5sYXRpdHVkZSAgICAgPSBsYXRpdHVkZTtcclxuICAgICAgICB0aGlzLmxvbmdpdHVkZSAgICA9IGxvbmdpdHVkZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxsZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5wcm9kdWN0cyA9IFtdO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRTZWxsZXIoIHNlbGxlciApIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxsZXJzLnB1c2goIHNlbGxlciApO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFByb2R1Y3QoIHByb2R1Y3QgKSB7XHJcblxyXG4gICAgICAgIHRoaXMucHJvZHVjdHMucHVzaCggcHJvZHVjdCApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNob3A7IiwiY29uc3QgR29vZ2xlTWFwc0xvYWRlciA9IHJlcXVpcmUoJ2dvb2dsZS1tYXBzJyksXHJcbi8vIHJlcXVpcmUgZGUgbGEgY2xhc3NlIG91IGRlIGwnaW5zdGFuY2VcclxuQXBwID0gcmVxdWlyZShcIi4vY2xhc3MvQXBwXCIpOyBcclxuU2hvcCA9IHJlcXVpcmUoXCIuL2NsYXNzL1Nob3BcIik7XHJcblNlbGxlciA9IHJlcXVpcmUoXCIuL2NsYXNzL1NlbGxlclwiKTtcclxuUHJvZHVjdCA9IHJlcXVpcmUoXCIuL2NsYXNzL1Byb2R1Y3RcIik7XHJcbkdvb2dsZU1hcHNMb2FkZXIuS0VZID0gXCJBSXphU3lEX0RXM3VhSnJCS3lEOGpFYVg1QnZjd3hzbnN3eE8yb0VcIjtcclxuR29vZ2xlTWFwc0xvYWRlci5sb2FkKGZ1bmN0aW9uKClcclxue1xyXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xyXG4gICAgYXBwLmluaXRNYXAoXCJtYXBcIik7XHJcbiAgICBhcHAubG9hZERhdGFTaG9wKCk7XHJcblxyXG4gICAgYXBwLiRmb3JtX3Nob3Aub25zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgYXBwLmFkZE1hcmtlcigpO1xyXG4gICAgICAgIGNvbnN0IHNob3AgPSBuZXcgU2hvcCggYXBwLiRkZW5vbWluYXRpb24udmFsdWUsIGFwcC4kbGF0aXR1ZGUudmFsdWUsIGFwcC4kbG9uZ2l0dWRlLnZhbHVlICkgO1xyXG4gICAgICAgIGFwcC5hZGRTaG9wKCBzaG9wICk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwLiRmb3JtX3NlbGxlci5vbnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBzZWxsZXIgPSBuZXcgU2VsbGVyKGFwcC4kbmFtZS52YWx1ZSwgYXBwLiRzdXJuYW1lLnZhbHVlLCBhcHAuJHNob3Bfc2VsbGVyLnZhbHVlKTtcclxuICAgICAgICBsZXQgdmFsdWUgPSBhcHAuJHNob3Bfc2VsbGVyLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHNob3AgPSBhcHAuZ2V0U2hvcEJ5RGVub21pbmF0aW9uKCB2YWx1ZSApO1xyXG4gICAgICAgIHNob3AuYWRkU2VsbGVyKCBzZWxsZXIgKTtcclxuICAgICAgICBhcHAuc2F2ZURhdGFTaG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwLiRmb3JtX3Byb2R1Y3Qub25zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IG5ldyBQcm9kdWN0KGFwcC4kbGFiZWwudmFsdWUsIGFwcC4kcHJpY2UudmFsdWUsIGFwcC4kaW1hZ2UudmFsdWUsIGFwcC4kc2hvcF9wcm9kdWN0LnZhbHVlKTtcclxuICAgICAgICBsZXQgdmFsdWUgPSBhcHAuJHNob3BfcHJvZHVjdC52YWx1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IGFwcC5nZXRTaG9wQnlEZW5vbWluYXRpb24oIHZhbHVlICk7XHJcbiAgICAgICAgc2hvcC5hZGRQcm9kdWN0KCBwcm9kdWN0ICk7XHJcbiAgICAgICAgYXBwLnNhdmVEYXRhU2hvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcC5tYXAuYWRkTGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgYXBwLiRsYXRpdHVkZS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sYXQoKTtcclxuICAgICAgICBhcHAuJGxvbmdpdHVkZS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sbmcoKTtcclxuICAgIH0pO1xyXG59KTsiLCIoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuXG5cdGlmIChyb290ID09PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdHb29nbGUtbWFwcyBwYWNrYWdlIGNhbiBiZSB1c2VkIG9ubHkgaW4gYnJvd3NlcicpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHtcblx0XHRyb290Lkdvb2dsZU1hcHNMb2FkZXIgPSBmYWN0b3J5KCk7XG5cdH1cblxufSkodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBudWxsLCBmdW5jdGlvbigpIHtcblxuXG5cdCd1c2Ugc3RyaWN0JztcblxuXG5cdHZhciBnb29nbGVWZXJzaW9uID0gJzMuMTgnO1xuXG5cdHZhciBzY3JpcHQgPSBudWxsO1xuXG5cdHZhciBnb29nbGUgPSBudWxsO1xuXG5cdHZhciBsb2FkaW5nID0gZmFsc2U7XG5cblx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuXG5cdHZhciBvbkxvYWRFdmVudHMgPSBbXTtcblxuXHR2YXIgb3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2QgPSBudWxsO1xuXG5cblx0dmFyIEdvb2dsZU1hcHNMb2FkZXIgPSB7fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIuVVJMID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9qcyc7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5LRVkgPSBudWxsO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuTElCUkFSSUVTID0gW107XG5cblx0R29vZ2xlTWFwc0xvYWRlci5DTElFTlQgPSBudWxsO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuQ0hBTk5FTCA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5MQU5HVUFHRSA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5SRUdJT04gPSBudWxsO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuVkVSU0lPTiA9IGdvb2dsZVZlcnNpb247XG5cblx0R29vZ2xlTWFwc0xvYWRlci5XSU5ET1dfQ0FMTEJBQ0tfTkFNRSA9ICdfX2dvb2dsZV9tYXBzX2FwaV9wcm92aWRlcl9pbml0aWFsaXphdG9yX18nO1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5fZ29vZ2xlTW9ja0FwaU9iamVjdCA9IHt9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5sb2FkID0gZnVuY3Rpb24oZm4pIHtcblx0XHRpZiAoZ29vZ2xlID09PSBudWxsKSB7XG5cdFx0XHRpZiAobG9hZGluZyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRpZiAoZm4pIHtcblx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChmbik7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdHdpbmRvd1tHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJlYWR5KGZuKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlcigpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZm4pIHtcblx0XHRcdGZuKGdvb2dsZSk7XG5cdFx0fVxuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5jcmVhdGVMb2FkZXIgPSBmdW5jdGlvbigpIHtcblx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdHNjcmlwdC5zcmMgPSBHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZVVybCgpO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5pc0xvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnb29nbGUgIT09IG51bGw7XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZVVybCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB1cmwgPSBHb29nbGVNYXBzTG9hZGVyLlVSTDtcblxuXHRcdHVybCArPSAnP2NhbGxiYWNrPScgKyBHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FO1xuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuS0VZKSB7XG5cdFx0XHR1cmwgKz0gJyZrZXk9JyArIEdvb2dsZU1hcHNMb2FkZXIuS0VZO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLkxJQlJBUklFUy5sZW5ndGggPiAwKSB7XG5cdFx0XHR1cmwgKz0gJyZsaWJyYXJpZXM9JyArIEdvb2dsZU1hcHNMb2FkZXIuTElCUkFSSUVTLmpvaW4oJywnKTtcblx0XHR9XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5DTElFTlQpIHtcblx0XHRcdHVybCArPSAnJmNsaWVudD0nICsgR29vZ2xlTWFwc0xvYWRlci5DTElFTlQgKyAnJnY9JyArIEdvb2dsZU1hcHNMb2FkZXIuVkVSU0lPTjtcblx0XHR9XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5DSEFOTkVMKSB7XG5cdFx0XHR1cmwgKz0gJyZjaGFubmVsPScgKyBHb29nbGVNYXBzTG9hZGVyLkNIQU5ORUw7XG5cdFx0fVxuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuTEFOR1VBR0UpIHtcblx0XHRcdHVybCArPSAnJmxhbmd1YWdlPScgKyBHb29nbGVNYXBzTG9hZGVyLkxBTkdVQUdFO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLlJFR0lPTikge1xuXHRcdFx0dXJsICs9ICcmcmVnaW9uPScgKyBHb29nbGVNYXBzTG9hZGVyLlJFR0lPTjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5yZWxlYXNlID0gZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgcmVsZWFzZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5LRVkgPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5MSUJSQVJJRVMgPSBbXTtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuQ0xJRU5UID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuQ0hBTk5FTCA9IG51bGw7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLkxBTkdVQUdFID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuUkVHSU9OID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuVkVSU0lPTiA9IGdvb2dsZVZlcnNpb247XG5cblx0XHRcdGdvb2dsZSA9IG51bGw7XG5cdFx0XHRsb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRjYWxsYmFja3MgPSBbXTtcblx0XHRcdG9uTG9hZEV2ZW50cyA9IFtdO1xuXG5cdFx0XHRpZiAodHlwZW9mIHdpbmRvdy5nb29nbGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGRlbGV0ZSB3aW5kb3cuZ29vZ2xlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIHdpbmRvd1tHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0ZGVsZXRlIHdpbmRvd1tHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9yaWdpbmFsQ3JlYXRlTG9hZGVyTWV0aG9kICE9PSBudWxsKSB7XG5cdFx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlTG9hZGVyID0gb3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2Q7XG5cdFx0XHRcdG9yaWdpbmFsQ3JlYXRlTG9hZGVyTWV0aG9kID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHNjcmlwdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRzY3JpcHQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXHRcdFx0XHRzY3JpcHQgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZm4pIHtcblx0XHRcdFx0Zm4oKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKGxvYWRpbmcpIHtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIubG9hZChmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVsZWFzZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbGVhc2UoKTtcblx0XHR9XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLm9uTG9hZCA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0b25Mb2FkRXZlbnRzLnB1c2goZm4pO1xuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5tYWtlTW9jayA9IGZ1bmN0aW9uKCkge1xuXHRcdG9yaWdpbmFsQ3JlYXRlTG9hZGVyTWV0aG9kID0gR29vZ2xlTWFwc0xvYWRlci5jcmVhdGVMb2FkZXI7XG5cblx0XHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0d2luZG93Lmdvb2dsZSA9IEdvb2dsZU1hcHNMb2FkZXIuX2dvb2dsZU1vY2tBcGlPYmplY3Q7XG5cdFx0XHR3aW5kb3dbR29vZ2xlTWFwc0xvYWRlci5XSU5ET1dfQ0FMTEJBQ0tfTkFNRV0oKTtcblx0XHR9O1xuXHR9O1xuXG5cblx0dmFyIHJlYWR5ID0gZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgaTtcblxuXHRcdGxvYWRpbmcgPSBmYWxzZTtcblxuXHRcdGlmIChnb29nbGUgPT09IG51bGwpIHtcblx0XHRcdGdvb2dsZSA9IHdpbmRvdy5nb29nbGU7XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMDsgaSA8IG9uTG9hZEV2ZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0b25Mb2FkRXZlbnRzW2ldKGdvb2dsZSk7XG5cdFx0fVxuXG5cdFx0aWYgKGZuKSB7XG5cdFx0XHRmbihnb29nbGUpO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNhbGxiYWNrc1tpXShnb29nbGUpO1xuXHRcdH1cblxuXHRcdGNhbGxiYWNrcyA9IFtdO1xuXHR9O1xuXG5cblx0cmV0dXJuIEdvb2dsZU1hcHNMb2FkZXI7XG5cbn0pO1xuIl19
