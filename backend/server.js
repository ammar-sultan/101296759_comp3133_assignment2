const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const typeDefs = require("./schemas/schema");
const resolvers = require("./resolvers/resolver");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());

// Import routes
const employeeRoutes = require("./routes/employees");
const authRoutes = require("./routes/auth");

// Use routes
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Apollo Server setup
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql", cors: false });

  const PORT = process.env.PORT || 4000;
  const HOST = process.env.HOST || "0.0.0.0";

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(
      `🚀 GraphQL playground available at https://${
        process.env.RENDER_EXTERNAL_URL || "localhost"
      }:${PORT}/graphql`
    );
  });
}

startServer();
