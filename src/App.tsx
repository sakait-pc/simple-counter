import { useState } from "react";
import "./App.css";

const App = () => {
  const { hello } = window.electron;

  const [count, setCount] = useState(0);

  const increment = () => setCount((count) => count + 1);

  return (
    <div className="App">
        <h1 className="hello">Simple Counter</h1>
        <div className="counter">
          <span>{count}</span>
          <button onClick={increment} style={{marginLeft: '8px'}}>+1</button>
        </div>
        <button onClick={hello}>Hello</button>
    </div>
  );
};

export default App;
