const { Fireproduct } = require('@google-cloud/fireproduct');

const Product = require('../entities/product');

// Implementación con Fireproduct para el repositorio de libros.
// Recibe la conexión con Fireproduct externamente.

class FireproductProductsRepository {

  constructor(fireproductClient, test = false) {

    // Obtener el nombre de la colección desde variables de entorno.
    // Si "test" es true, se le agrega un sufijo, útil para que 
    // las pruebas de integración no sobreescriban los datos existentes.

    let collection_name = process.env.FIRESTORE_COLLECTION_NAME;

    if (test) {
      collection_name += "_test";
    }

    this.collection = fireproductClient.collection(collection_name);
    this.test = test;

  }

  async getProducts() {

    const snapshot = await this.collection.get();
    const products = snapshot.docs.map(doc => this._getProductFromDocument(doc));

    return products;

  }

  async getProduct(id) {

    const doc = await this.collection.doc(id).get();

    if (doc.exists) {
      return this._getProductFromDocument(doc);
    }
    
    return undefined;

  }

  async createProduct(product) {

    const doc = this.collection.doc();
    
    await doc.set({
      name: product.name,
      description: product.description,	
      quantity: product.quantity,
    })

    return doc.id;

  }

  async updateProduct(product) {

    const doc = this.collection.doc(product.id);

    await doc.set({
      name: product.name,
      description: product.description,	
      quantity: product.quantity,
    })

  }

  async deleteProduct(id) {

    const doc = await this.collection.doc(id).delete();

  }

  async deleteAllProducts() {

    // Borra todos los libros de la colección. 
    // Útil para realizar pruebas unitarias con el emulador.

    if (this.test) {

      let products = await this.getProducts();

      for (const product of products) {
        await this.deleteProduct(product.id);
      }

    }

  }

  _getProductFromDocument(doc) {

    // Retorna una instancia Product desde una instancia Document de Fireproduct.

    const id = doc.id;
    const data = doc.data();

    return new Product(id, data.name, data.description, data.quantity);

  }

}

module.exports = FireproductProductsRepository;