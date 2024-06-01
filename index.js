const express = require("express");

const adminRouter = require("./routes/adminRoute");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoutes");

const db = require("./config/db");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(adminRouter);
app.use(authRouter);
app.use(productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
