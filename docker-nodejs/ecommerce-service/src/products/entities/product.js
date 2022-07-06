// Entidad libro.

class Product {
  static schema = {
    type: "object",
    properties: {
      name: { type: "string", errorMessage: "must be of string type" },
      description: { type: "string", errorMessage: "must be of string type" },
      quantity: { type: "integer", errorMessage: "must be of integer type" },
      sku: { type: "string", errorMessage: "must be of string type" },
    },
    required: ["name", "description", "quantity"],
    additionalProperties: false,
  };

  constructor(id, name, description, quantity, sku) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.sku = sku;
  }
}

module.exports = Product;
