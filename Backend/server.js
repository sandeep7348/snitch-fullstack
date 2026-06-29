import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

console.log("Starting backend server...");
console.log("Node environment:", process.env.NODE_ENV || "development");
connectToDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});
