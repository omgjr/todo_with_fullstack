import { useState } from "react";
import "./App.css";
import Todos from "./templates/Todos";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Todos />
    </div>
  );
}

export default App;
