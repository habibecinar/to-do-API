import e from "express";

export const app = e();

// JSON verilerini işlemek için middleware
app.use(e.json());

// Basit bir GET endpoint'i
app.get("/", (req, res) => {
  res.send("Hello World!");
});
//sunucu dinletme
const PORT =  3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
