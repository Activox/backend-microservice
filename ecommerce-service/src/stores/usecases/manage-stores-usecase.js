const Store = require("../entities/store");

// Casos de uso para el manejo de libros.
// Acá va la lógica de negocio agnóstica a los frameworks,
// recibiendo como parámetros las dependencias necesarias.

class ManageStoresUsecase {
  constructor(storesRepository) {
    this.storesRepository = storesRepository;
  }

  async getStores() {
    return await this.storesRepository.getStores();
  }

  async getStore(id) {
    return await this.storesRepository.getStore(id);
  }
  async getStoreByName(name) {
    return await this.storesRepository.getStoreByName(name);
  }

  async createStore(data) {
    const store = new Store(
      undefined,
      data.name,
      data.description,
      data.userId,
      data.warehouseAddress
    );
    const id = await this.storesRepository.createStore(store);
    store.id = id;

    return store;
  }

  async updateStore(id, data) {
    const store = new Store(
      id,
      data.name,
      data.description,
      data.userId,
      data.warehouseAddress
    );
    await this.storesRepository.updateStore(store);

    return store;
  }

  async deleteStore(id) {
    await this.storesRepository.deleteStore(id);
  }
}

module.exports = ManageStoresUsecase;
