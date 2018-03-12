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