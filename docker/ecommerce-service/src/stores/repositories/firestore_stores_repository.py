import os

from src.stores.entities.store import Store

# Implementación con Firestore para el repositorio de tiendas.


class FirestoreStoresRepository:
    def __init__(self, firestore_client, test=False):

        # Obtener el nombre de la colección desde variables de entorno.
        # Si "test" es true, se le agrega un sufijo, útil para que
        # las pruebas de integración no sobreescriban los datos existentes.

        self.test = test
        collection_name = os.environ["FIRESTORE_COLLECTION_NAME"]

        if test:
            collection_name += "_test"

        self.collection = firestore_client.collection(collection_name)

    def get_stores(self, name=None, store_user_id=None):

        # Trae una lista de tiendas desde la colección de Firestore.
        # Al buscarlos, los transforma a entidad Store antes de retornarlos.
        # Opcionalmente puede recibir parámetros para filtrar por algún campo.

        results = self.collection.where("deleted_at", "==", None)

        if name:
            results = results.where("name", "==", name)

        if store_user_id:
            results = results.where("store_user_id", "==", store_user_id)

        stores = []

        for document in results.stream():

            content = document.to_dict()
            content["id"] = document.id

            store = Store.from_dict(content)
            stores.append(store)

        return stores

    def get_store(self, store_id):

        content = self.collection.document(store_id).get().to_dict()

        if content and content.get("deleted_at") == None:

            content["id"] = store_id
            store = Store.from_dict(content)

            return store

        else:
            return None

    def create_store(self, store):

        content = store.to_dict()
        content.pop("id")

        document = self.collection.document()
        document.set(content)

        store.id = document.id

        return store

    def update_store(self, store_id, fields):

        # Actualiza la lista de campos recibida el documento especificado.

        document = self.collection.document(store_id).update(fields)
        return self.get_store(store_id)

    def hard_delete_store(self, store_id):

        # Hace un borrado real de un tienda. Sólo usado durante tests.

        if self.test:
            self.collection.document(store_id).delete()

    def hard_delete_all_stores(self):

        # Borra todos los tiendas de la colección. Sólo usado durante tests.

        if self.test:

            for document in self.collection.stream():
                self.hard_delete_store(document.id)
