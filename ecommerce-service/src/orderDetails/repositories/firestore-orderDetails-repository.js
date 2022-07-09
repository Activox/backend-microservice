const { Fireorderdetail } = require("@google-cloud/fireorderdetail");

const OrderDetail = require("../entities/orderdetail");

// Implementación con Fireorderdetail para el repositorio de libros.
// Recibe la conexión con Fireorderdetail externamente.

class FireorderdetailOrderDetailsRepository {
  constructor(fireorderdetailClient, test = false) {
    // Obtener el nombre de la colección desde variables de entorno.
    // Si "test" es true, se le agrega un sufijo, útil para que
    // las pruebas de integración no sobreescriban los datos existentes.

    let collection_name = process.env.FIRESTORE_COLLECTION_NAME;

    if (test) {
      collection_name += "_test";
    }

    this.collection = fireorderdetailClient.collection(collection_name);
    this.test = test;
  }

  async getOrderDetails() {
    const snapshot = await this.collection.get();
    const orderdetails = snapshot.docs.map((doc) =>
      this._getOrderDetailFromDocument(doc)
    );

    return orderdetails;
  }

  async getOrderDetail(id) {
    const doc = await this.collection.doc(id).get();

    if (doc.exists) {
      return this._getOrderDetailFromDocument(doc);
    }

    return undefined;
  }

  async createOrderDetail(orderdetail) {
    const doc = this.collection.doc();

    await doc.set({
      orderId: orderdetail.orderId,
      productId: orderdetail.productId,
      quantity: orderdetail.quantity,
    });

    return doc.id;
  }

  async updateOrderDetail(orderdetail) {
    const doc = this.collection.doc(orderdetail.id);

    await doc.set({
      orderId: orderdetail.orderId,
      productId: orderdetail.productId,
      quantity: orderdetail.quantity,
    });
  }

  async deleteOrderDetail(id) {
    const doc = await this.collection.doc(id).delete();
    return doc;
  }

  async deleteAllOrderDetails() {
    // Borra todos los libros de la colección.
    // Útil para realizar pruebas unitarias con el emulador.

    if (this.test) {
      let orderdetails = await this.getOrderDetails();

      for (const orderdetail of orderdetails) {
        await this.deleteOrderDetail(orderdetail.id);
      }
    }
  }

  _getOrderDetailFromDocument(doc) {
    // Retorna una instancia OrderDetail desde una instancia Document de Fireorderdetail.

    const id = doc.id;
    const data = doc.data();

    return new OrderDetail(id, data.name, data.description, data.quantity);
  }
}

module.exports = FireorderdetailOrderDetailsRepository;
