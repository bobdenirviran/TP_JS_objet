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