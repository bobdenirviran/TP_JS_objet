class Product {

    constructor( label, price, image, magasin = [] ) {

        this.label          = label;
        this.price          = price;
        this.image          = image;
        this.shop_product   = magasin;

    }
}
module.exports = Product;