const { Fireorder } = require('@google-cloud/fireorder');

const Order = require('../entities/order');

// Implementación con Fireorder para el repositorio de libros.
// Recibe la conexión con Fireorder externamente.

class FireorderOrdersRepository {

  constructor(fireorderClient, test = false) {

    // Obtener el nombre de la colección desde variables de entorno.
    // Si "test" es true, se le agrega un sufijo, útil para que 
    // las pruebas de integración no sobreescriban los datos existentes.

    let collection_name = process.env.FIRESTORE_COLLECTION_NAME;

    if (test) {
      collection_name += "_test";
    }

    this.collection = fireorderClient.collection(collection_name);
    this.test = test;

  }

  async getOrders() {

    const snapshot = await this.collection.get();
    const orders = snapshot.docs.map(doc => this._getOrderFromDocument(doc));

    return orders;

  }

  async getOrder(id) {

    const doc = await this.collection.doc(id).get();

    if (doc.exists) {
      return this._getOrderFromDocument(doc);
    }
    
    return undefined;

  }

  async createOrder(order) {

    const doc = this.collection.doc();
    
    await doc.set({
      storeId: order.storeId,
      userId: order.userId,
    })

    return doc.id;

  }

  async updateOrder(order) {

    const doc = this.collection.doc(order.id);

    await doc.set({
      storeId: order.storeId,
      userId: order.userId,
    })

  }

  async deleteOrder(id) {
    const doc = await this.collection.doc(id).delete();
    return doc
  }

  async deleteAllOrders() {

    // Borra todos los libros de la colección. 
    // Útil para realizar pruebas unitarias con el emulador.

    if (this.test) {

      let orders = await this.getOrders();

      for (const order of orders) {
        await this.deleteOrder(order.id);
      }

    }

  }

  _getOrderFromDocument(doc) {

    // Retorna una instancia Order desde una instancia Document de Fireorder.

    const id = doc.id;
    const data = doc.data();

    return new Order(id, data.name, data.description, data.quantity);

  }

}

module.exports = FireorderOrdersRepository;