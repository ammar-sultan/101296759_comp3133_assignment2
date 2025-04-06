const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const typeDefs = require("./schemas/schema");
const resolvers = require("./resolvers/resolver");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "https://comp3133_frontend-domain.com", // Update with the actual frontend domain
      "http://localhost:4200",
    ],
    credentials: true,
  })
);

app.use(express.json());

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app, cors: false });
  const PORT = process.env.PORT || 4000;
  const HOST = process.env.HOST || "0.0.0.0";

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(
      `🚀 GraphQL playground available at http://${HOST}:${PORT}/graphql`
    );
  });
}

startServer();
