// Entidad libro.

class User {
  static schema = {
    type: "object",
    properties: {
      name: { type: "string", errorMessage: "must be of string type" },
      type: { type: "string", errorMessage: "must be of string type" },
      email: { type: "string", errorMessage: "must be of string type" },
      shippingAddress: {
        type: "string",
        errorMessage: "must be of string type",
      },
    },
    required: ["name", "type", "email"],
    additionalProperties: false,
  };

  constructor(id, name, type, email, shippingAddress) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.email = email;
    this.shippingAddress = shippingAddress;
  }
}

module.exports = User;
