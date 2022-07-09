const { Firestore } = require("@google-cloud/firestore");

const User = require("../entities/user");

// Implementación con Firestore para el repositorio de libros.
// Recibe la conexión con Firestore externamente.

class FirestoreUsersRepository {
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

  async getUsers() {
    const snapshot = await this.collection.get();
    const users = snapshot.docs.map((doc) => this._getUserFromDocument(doc));

    return users;
  }

  async getUser(id) {
    const doc = await this.collection.doc(id).get();

    if (doc.exists) {
      return this._getUserFromDocument(doc);
    }

    return undefined;
  }

  async validateUserEmail(email) {
    // Retorna true si el email ya existe en la colección.
    const snapshot = await this.collection.where("email", "==", email).get();
    return snapshot.exists;
  }

  async createUser(user) {
    const doc = this.collection.doc();

    await doc.set({
      name: user.name,
      type: user.type,
      email: user.email,
      shippingAddress: user.shippingAddress,
    });

    return doc.id;
  }

  async updateUser(user) {
    const doc = this.collection.doc(user.id);

    await doc.set({
      name: user.name,
      type: user.type,
      email: user.email,
      shippingAddress: user.shippingAddress,
    });
  }

  async deleteUser(id) {
    const doc = await this.collection.doc(id).delete();
  }

  async deleteAllUsers() {
    // Borra todos los libros de la colección.
    // Útil para realizar pruebas unitarias con el emulador.

    if (this.test) {
      let users = await this.getUsers();

      for (const user of users) {
        await this.deleteUser(user.id);
      }
    }
  }

  _getUserFromDocument(doc) {
    // Retorna una instancia User desde una instancia Document de Firestore.

    const id = doc.id;
    const data = doc.data();

    return new User(id, data.name, data.type, data.email, data.shippingAddress);
  }
}

module.exports = FirestoreUsersRepository;
