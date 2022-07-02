from flask import Blueprint, request

from enviame.inputvalidation import validate_schema_flask, SUCCESS_CODE, FAIL_CODE

from src.stores.http.validation import store_validatable_fields


# Endpoints para CRUD de Stores.

# Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
# relevantes a los casos de uso correspondientes. Esta capa no debe
# contener lógica de negocio, sólo lo necesario para recibir y entregar
# respuestas válidas al mundo exterior.

# Se realiza la validación de datos de entrada mediante el decorador
# "@validate_schema_flask", el cual recibe como argumento un diccionario definido
# en el archivo "store_validatable_fields". No sólo valida que todos los campos
# requeridos vengan en el payload, sino que también que no vengan campos de más.


def create_stores_blueprint(manage_stores_usecase):

    blueprint = Blueprint("stores", __name__)

    @blueprint.route("/stores", methods=["GET"])
    def get_stores():

        stores = manage_stores_usecase.get_stores()

        stores_dict = []
        for store in stores:
            stores_dict.append(store.serialize())

        data = stores_dict
        code = SUCCESS_CODE
        message = "Stores obtained succesfully"
        http_code = 200

        response = {
            "code": code,
            "message": message,
            "data": data,
        }

        return response, http_code

    @blueprint.route("/stores/<string:store_id>", methods=["GET"])
    def get_store(store_id):

        store = manage_stores_usecase.get_store(store_id)

        if store:
            data = store.serialize()
            code = SUCCESS_CODE
            message = "Store obtained succesfully"
            http_code = 200

        else:
            data = None
            code = FAIL_CODE
            message = f"Store of ID {store_id} does not exist."
            http_code = 404

        response = {
            "code": code,
            "message": message,
        }

        if data:
            response["data"] = data

        return response, http_code

    @blueprint.route("/stores", methods=["POST"])
    @validate_schema_flask(store_validatable_fields.STORE_CREATION_VALIDATABLE_FIELDS)
    def create_store():

        body = request.get_json()

        try:
            store_user_id = body.get("store_user_id")
            if store_user_id:
                is_user_exist = manage_stores_usecase.is_user_exist(store_user_id)
                if is_user_exist:
                    store = manage_stores_usecase.create_store(body)
                    data = store.serialize()
                    code = SUCCESS_CODE
                    message = "Store created succesfully"
                    http_code = 201
                else:
                    data = None
                    code = FAIL_CODE
                    message = f"User of ID {store_user_id} does not exist."
                    http_code = 404
            else:
                data = None
                code = FAIL_CODE
                message = "Store user ID is required."
                http_code = 400

        except ValueError as e:
            data = None
            code = FAIL_CODE
            message = str(e)
            http_code = 400

        response = {
            "code": code,
            "message": message,
        }

        if data:
            response["data"] = data

        return response, http_code

    @blueprint.route("/stores/<string:store_id>", methods=["PUT"])
    @validate_schema_flask(store_validatable_fields.STORE_UPDATE_VALIDATABLE_FIELDS)
    def update_store(store_id):

        body = request.get_json()

        try:
            store = manage_stores_usecase.update_store(store_id, body)
            data = store.serialize()
            message = "Store updated succesfully"
            code = SUCCESS_CODE
            http_code = 200

        except ValueError as e:
            data = None
            code = FAIL_CODE
            message = str(e)
            http_code = 400

        response = {
            "code": code,
            "message": message,
        }

        if data:
            response["data"] = data

        return response, http_code

    @blueprint.route("/stores/<string:store_id>", methods=["DELETE"])
    def delete_store(store_id):

        try:
            manage_stores_usecase.delete_store(store_id)
            code = SUCCESS_CODE
            message = f"Store of ID {store_id} deleted succesfully."
            http_code = 200

        except ValueError as e:
            code = FAIL_CODE
            message = str(e)
            http_code = 400

        response = {
            "code": code,
            "message": message,
        }

        return response, http_code

    return blueprint
