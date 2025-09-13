import Todo from "../models/Todo.js";

// Tüm Todo'ları listele
export const getTodos = async (req, res) => {
  try {
    let query = {};

    // Search (title içinde kelime arama)
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" }; // i -> case insensitive
    }

    // Completed filter
    if (req.query.completed !== undefined) {
      query.completed = req.query.completed === "true";
    }

    // MongoDB sorgusu
    let todosQuery = Todo.find(query);

    // Sort
    if (req.query.sort === "asc") {
      todosQuery = todosQuery.sort({ title: 1 });  // 1 = ascending
    } else if (req.query.sort === "desc") {
      todosQuery = todosQuery.sort({ title: -1 }); // -1 = descending
    }

    const todos = await todosQuery;
    res.json(todos);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Yeni Todo ekle
export const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTodo = await Todo.create({ title, completed: false });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ID’ye göre Todo getir
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Todo güncelle
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true, runValidators: true } // runValidators → model kurallarına göre kontrol eder
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Todo sil
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully", todo: deletedTodo });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
