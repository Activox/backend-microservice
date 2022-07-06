const { Firestore } = require('@google-cloud/firestore');

const Store = require('../entities/store');

// Implementación con Firestore para el repositorio de libros.
// Recibe la conexión con Firestore externamente.

class FirestoreStoresRepository {

  constructor(firestoreClient, test = false) {

    // Obtener el nombre de la colección desde variables de entorno.
    // Si "test" es true, se le agrega un sufijo, útil para que 
    // las pruebas de integración no sobreescriban los datos existentes.

    let collection_name = process.env.FIRESTORE_COLLECTION_NAME;

    if (test) {
      collection_name += "_test";
    }

    this.collection = firestoreClient.collection(collection_name);
    this.test = test;

  }

  async getStores() {

    const snapshot = await this.collection.get();
    const stores = snapshot.docs.map(doc => this._getStoreFromDocument(doc));

    return stores;

  }

  async getStore(id) {

    const doc = await this.collection.doc(id).get();

    if (doc.exists) {
      return this._getStoreFromDocument(doc);
    }
    
    return undefined;

  }

  async createStore(store) {

    const doc = this.collection.doc();
    
    await doc.set({
      name: store.name,
      description: store.description,	
      userId: store.userId,
      warehouseAddress: store.warehouseAddress,
    })

    return doc.id;

  }

  async updateStore(store) {

    const doc = this.collection.doc(store.id);

    await doc.set({
      name: store.name,
      description: store.description,	
      userId: store.userId,
      warehouseAddress: store.warehouseAddress,
    })

  }

  async deleteStore(id) {

    const doc = await this.collection.doc(id).delete();

  }

  async deleteAllStores() {

    // Borra todos los libros de la colección. 
    // Útil para realizar pruebas unitarias con el emulador.

    if (this.test) {

      let stores = await this.getStores();

      for (const store of stores) {
        await this.deleteStore(store.id);
      }

    }

  }

  _getStoreFromDocument(doc) {

    // Retorna una instancia Store desde una instancia Document de Firestore.

    const id = doc.id;
    const data = doc.data();

    return new Store(id, data.name, data.description, data.userId, data.warehouseAddress);

  }

}

module.exports = FirestoreStoresRepository;