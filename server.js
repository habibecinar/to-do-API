import e from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import todoRoutes from "./routes/todos.js";
import cors from "cors";

dotenv.config();
connectDB();

export const app = e();

// JSON verilerini işlemek için middleware
app.use(e.json());
app.use(cors()); // CORS middleware'ini ekle

// Basit bir GET endpoint'i
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Todo route'larını kullan
app.use("/todos", todoRoutes);
//sunucu dinletme
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
