import { Router } from "express";
import Todo from "../models/Todo.js";

const router = Router();

// Tüm Todos
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: "i" };
  }
  if (req.query.completed !== undefined) {
    query.completed = req.query.completed === "true";
  }

  let todos = await Todo.find(query);

  if (req.query.sort === "asc") {
    todos.sort((a, b) => a.title.localeCompare(b.title));
  } else if (req.query.sort === "desc") {
    todos.sort((a, b) => b.title.localeCompare(a.title));
  }

  res.json(todos);
});

// Yeni Todo
router.post("/", async (req, res) => {
  const { title } = req.body;
  const newTodo = await Todo.create({ title });
  res.status(201).json(newTodo);
});

// Tek Todo
router.get("/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

// Güncelle
router.put("/:id", async (req, res) => {
  const { title, completed } = req.body;
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { title, completed },
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

// Sil
router.delete("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

export default router;
