from src.stores.entities.store import Store
from src.users.repositories.firestore_users_repository import FirestoreUsersRepository
from src.utils import utils

# Casos de uso para el manejo de tiendas.

# Recibe en el constructor el repositorio a utilizar. Da igual si recibe el repositorio
# de SQL o de Firestore, el caso de uso debe funcionar independientemente de su implementación.


class ManageStoresUsecase:
    def __init__(self, stores_repository):
        self.stores_repository = stores_repository

    def get_stores(self):

        # Retorna una lista de entidades Store desde el repositorio.

        return self.stores_repository.get_stores()

    def get_store(self, store_id):

        # Retorna una instancia de Store según la ID recibida.

        return self.stores_repository.get_store(store_id)

    def create_store(self, data):

        # Crea una instancia Store desde la data recibida, que ya debe venir validada desde afuera,
        # y guarda dicha instancia en el repositorio para finalmente retornarla.

        current_time = utils.get_current_datetime()

        data["created_at"] = current_time
        data["updated_at"] = current_time

        store = Store.from_dict(data)
        store = self.stores_repository.create_store(store)

        return store

    def update_store(self, store_id, data):

        # Actualiza los datos recibidos y los guarda en el repositorio según la ID recibida.
        # La data no necesariamente debe contener todos los campos de la entidad, sólo
        # los campos que se van a actualizar. Esta data debe venir validada desde afuera.

        store = self.get_store(store_id)

        if store:

            data["updated_at"] = utils.get_current_datetime()
            store = self.stores_repository.update_store(store_id, data)

            return store

        else:
            raise ValueError(f"Store of ID {store_id} doesn't exist.")

    def delete_store(self, store_id):

        # Realiza un soft-delete del tienda con la ID especificada, si es que existe.
        # A nivel de repositorio realiza una actualización al campo "deleted_at".

        store = self.get_store(store_id)

        if store:

            data = {"deleted_at": utils.get_current_datetime()}

            store = self.stores_repository.update_store(store_id, data)

        else:
            raise ValueError(
                f"Store of ID {store_id} doesn't exist or is already deleted."
            )

    def is_user_exist(self, user_id):

        # Retorna True si el usuario con la ID recibida existe en el repositorio, False en caso contrario.
        user = FirestoreUsersRepository.get_user(self, user_id)
        if user:
            return True

        else:
            return False
