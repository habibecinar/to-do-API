import e from "express";
import todoRoutes from "./routes/todoRoutes.js";

export const app = e();

// JSON verilerini işlemek için middleware
app.use(e.json());

// Basit bir GET endpoint'i
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Todo route'larını kullan
app.use("/todos", todoRoutes);
//sunucu dinletme
const PORT =  3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
