import { Router } from "express";

const router = Router();

//geçici veri saklama
let todos = [];
let nextId = 1;

// Todo'ları listele
router.get("/", (req, res) => {
  res.json(todos);
});

// Yeni bir Todo ekle
router.post("/", (req, res) => {
  const { title } = req.body;
  const newTodo = { id: nextId++, title, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

//tek görev göster
router.get("/:id", (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
});
// Görev güncelle
router.put("/:id", (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    
    const { title, completed } = req.body;
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    
    res.json(todo);
});
// Görev sil
router.delete("/:id", (req, res) => {
    const index = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Todo not found" });
    
    const deletedTodo = todos.splice(index, 1);
    res.json(deletedTodo[0]);
});
export default router;
