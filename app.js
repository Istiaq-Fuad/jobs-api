require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");
const connectDB = require("./db/connect");
const auth = require("./middleware/authentication");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// routes
app.get("/", (req, res) => {
  res.send("<h1>Jobs Api</h1><a href='/api-docs'>Go to documentation</a>");
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", auth, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
