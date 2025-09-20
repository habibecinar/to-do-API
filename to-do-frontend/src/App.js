import "./App.css";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Backend'den veriyi çek
  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:3000/todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Todo ekleme
  const handleAdd = async () => {
    if (!newTodo) return;
    try {
      await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo, completed: false }),
      });
      setNewTodo("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Todo silme
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Drag & Drop sonrası güncelleme
  const onDragEnd = async (result) => {
  console.log("onDragEnd result:", result);
  const { source, destination, draggableId } = result;

  if (!destination) {
    console.log("Geçersiz bırakma alanı");
    return;
  }

  if (source.droppableId === destination.droppableId &&
      source.index === destination.index) {
    console.log("Aynı yerde bırakıldı");
    return;
  }

  let update = {};
  if (destination.droppableId === "toDo")
    update = { completed: false, inProgress: false };
  else if (destination.droppableId === "inProgress")
    update = { completed: false, inProgress: true };
  else if (destination.droppableId === "done")
    update = { completed: true, inProgress: false };

  try {
    const todo = todos.find((t) => String(t._id) === String(draggableId));
    if (!todo) return;

    await fetch(`http://localhost:3000/todos/${draggableId}`, {
      method: "PATCH", // 🔑 PATCH daha uygun
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, ...update }),
    });

    fetchTodos();
  } catch (err) {
    console.error(err);
  }
};

    // Todo kolonları
  const toDo = todos.filter((t) => !t.completed && !t.inProgress);
  const inProgress = todos.filter((t) => t.inProgress && !t.completed);
  const done = todos.filter((t) => t.completed);

  return (
    <div className="container">
      <h1>🔗 My To-do List</h1>

      <div className="input-group">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
        />
         <button onClick={handleAdd}>Add</button> 
      </div>


      <DragDropContext onDragEnd={onDragEnd}>
        <div className="dnd-columns">
          

      <Droppable droppableId="toDo">
  {(provided) => (
    <div ref={provided.innerRef} {...provided.droppableProps} className="dnd-column">
      <h3>To Do</h3>
      {toDo.map((todo, index) => (
        <Draggable key={todo._id} draggableId={todo._id} index={index}>
          {(provided) => (
            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <span>{todo.title}</span>
              <button className="delete" onClick={() => handleDelete(todo._id)}>Delete</button>
            </li>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>
  )}
</Droppable>
{/* In Progress */}
          <Droppable droppableId="inProgress">
            {(provided) => (
              <div
                className="dnd-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h3>In Progress</h3>
                {inProgress.map((todo, index) => (
                  <Draggable key={todo._id} draggableId={todo._id} index={index}>
                    {(provided) => (
                      <li
                        className="todo-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span>{todo.title}</span>
                        <button
                          className="delete"
                          onClick={() => handleDelete(todo._id)}
                        >
                          Delete
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Done */}
          <Droppable droppableId="done">
            {(provided) => (
              <div
                className="dnd-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3>Done</h3>
                {done.map((todo, index) => (
                  <Draggable key={todo._id} draggableId={todo._id} index={index}>
                    {(provided) => (
                      <li
                        className="todo-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span className="completed">{todo.title}</span>
                        <button
                          className="delete"
                          onClick={() => handleDelete(todo._id)}
                        >
                          Delete
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
