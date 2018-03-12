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