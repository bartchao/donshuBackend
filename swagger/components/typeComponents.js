exports.typeSchema = {
  Type: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int32",
        description: "typeId"
      },
      typeName: {
        type: "string",
        description: "TypeName"
      }
    }
  }
};
