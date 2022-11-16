import { useState, useEffect } from "react";
import type { Counter } from "./electron/entities";
import "./App.css";

const App = () => {
  const { fetchCounters } = window.electron;

  // const [count, setCount] = useState(0);
  const [$counters, setCounters] = useState<Counter[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const counters = await fetchCounters();
      setCounters(counters);
    };
    fetcher();
  }, []);

  // const increment = () => setCount((count) => count + 1);

  const exists = 0 < $counters.length;

  return (
    <div className="App">
        <h1 className="hello">Simple Counter</h1>
        <div className="counters">
          {exists && $counters.map((counter) =>
            <div className="counter">
              <span>{counter.name}</span>
              <span>{counter.count}</span>
              <span>{counter.lastUpdate}</span>
              {/* <button onClick={increment} style={{marginLeft: '8px'}}>+1</button> */}
            </div>
          )}
        </div>
    </div>
  );
};

export default App;
