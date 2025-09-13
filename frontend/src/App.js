import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Backend'den veri çek
  const fetchTodos = () => {
    fetch("http://localhost:3000/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Yeni todo ekleme
  const handleAdd = async () => {
    if (!newTodo) return;

    try {
      await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });
      setNewTodo("");
      fetchTodos(); // listeyi güncelle
    } catch (error) {
      console.error(error);
    }
  };

  // Todo silme
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" });
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // Todo tamamlandı işaretleme
  const handleToggle = async (todo) => {
    try {
      await fetch(`http://localhost:3000/todos/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Todo List</h1>
      
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Yeni todo ekle"
        />
        <button onClick={handleAdd}>Ekle</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <span
              style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}
              onClick={() => handleToggle(todo)}
            >
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo._id)} style={{ marginLeft: "1rem" }}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
