
// const Controller = require("../db/controller/");
// const { typeController } = Controller;
const { typeSchema } = require("./swagger/components/typeComponents");
const { topicSchema } = require("./swagger/components/topicComponents");
const { userSchema } = require("./swagger/components/userComponents");
const { postSchema } = require("./swagger/components/postComponents");

const outputFile = "./swagger/swagger_output.json"; // 輸出的文件名稱
const endpointsFiles = ["./src/app.js"]; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

const options = {
  openapi: "3.0.0",
  autoQuery: true, // Enable/Disable automatic query capture. By default is true
  autoBody: false,
  autoHeaders: false

};
const swaggerAutogen = require("swagger-autogen")(options);

const doc = {
  info: {
    version: "0.0.1", // by default: '1.0.0'
    title: "Donshi Backend Development API", // by default: 'REST API'
    description: "" // by default: ''
  },
  host: "localhost:3000", // by default: 'localhost:3000'
  basePath: "", // by default: '/'
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [ // by default: empty Array
    {
      name: "", // Tag name
      description: "" // Tag description
    }
    // { ... }
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header", // can be 'header', 'query' or 'cookie'
      name: "api-key", // name of the header, query parameter or cookie
      description: "API_KEY"
    },
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    }
  },
  definitions: {},
  components: {
    "@schemas": {
      ...typeSchema, ...topicSchema, ...userSchema, ...postSchema
    }
  } // by default: empty object (OpenAPI 3.x)
  // by default: empty object (Swagger 2.0)
};
swaggerAutogen(outputFile, endpointsFiles, doc); // swaggerAutogen 的方法
