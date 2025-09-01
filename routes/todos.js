import { Router } from "express";

const router = Router();

//geçici veri saklama
let todos = [];
let nextId = 1;

// Todo'ları listele
router.get("/", (req, res) => {
 let result = [...todos];//veriyi kopyaladık

 // Arama (search)
if (req.query.search) {
  const keyword = req.query.search.toLowerCase();
  result = result.filter(t => t.title.toLowerCase().includes(keyword));
}
    //tamamlanma durumuna göre filtreleme
    if(req.query.completed !== undefined){
        const isCompleted = req.query.completed === 'true';
        result = result.filter(t => t.completed === isCompleted);
    }
    //sıralama
    if(req.query.sort === 'asc'){
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else if(req.query.sort === 'desc'){
        result.sort((a, b) => b.title.localeCompare(a.title));
    }

    res.json(result);
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
