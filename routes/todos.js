import { Router } from "express";
import { getTodos,createTodo,getTodoById,updateTodo,deleteTodo,} from "../controllers/todoController.js";

const router = Router();

// Tüm Todos
router.get("/", getTodos);
// Yeni Todo oluştur
router.post("/", createTodo);
// Id'ye göre Todo'yu getir
router.get("/:id", getTodoById);
// Id'ye göre Todo'yu güncelle
router.put("/:id", updateTodo);
// Id'ye göre Todo'yu sil
router.delete("/:id", deleteTodo);

export default router;
