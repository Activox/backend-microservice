// Entidad libro.

class Store {
  static schema = {
    type: "object",
    properties: {
      name: { type: "string", errorMessage: "must be of string type" },
      description: { type: "string", errorMessage: "must be of string type" },
      userId: { type: "integer", errorMessage: "must be of integer type" },
      warehouseAddress: {
        type: "string",
        errorMessage: "must be of string type",
      },
    },
    required: ["name", "description", "userId"],
    additionalProperties: false,
  };

  constructor(id, name, description, userId, warehouseAddress) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.warehouseAddress = warehouseAddress;
  }
}

module.exports = Store;
