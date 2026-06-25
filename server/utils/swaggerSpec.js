// swagger.js
import swaggerJSDoc from "swagger-jsdoc";

// Swagger configuration options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Portfolio API",
      version: "1.0.0",
      description: "A simple API documentation for Portfolio project",
    },
    servers: [
      {
        url: "http://localhost:3000", // change to prod/staging when deploying
      },
    ],
  },
  // yeh batata hai kis file me Swagger comments likhe gaye hain
  apis: ["./routes/*.js"], // 👈 change path as per your route files
};

// Generate the swagger specification
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
