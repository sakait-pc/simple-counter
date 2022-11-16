import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { Counter } from "./electron/entities";
import "./App.css";

const handleError = (title: string, e: unknown) => {
  if (e instanceof Error) {
    alert(`${title}: ${e.message}`);
  } else {
    alert(`Unexpected error: ${e}`);
  }
};

const App = () => {
  const { fetchCounters, createCounter } = window.electron;

  // const [count, setCount] = useState(0);
  const [$counterName, setCounterName] = useState("");
  const [$counters, setCounters] = useState<Counter[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const counters = await fetchCounters();
        setCounters(counters);
      } catch (e) {
        handleError("Failed to fetch counters in fetcher()", e);
      }
    };
    fetcher();
  }, []);

  // const increment = () => setCount((count) => count + 1);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCounterName(e.target.value);
  };

  const create = async () => {
    const counterName = $counterName.trim();
    if (counterName === "") return;
    try {
      const counters = await createCounter(counterName);
      setCounters(counters);
    } catch (e) {
      handleError("Failed to create a counter in create()", e);
    }
  };

  const exists = 0 < $counters.length;

  return (
    <div className="App">
      <h1 className="hello">Simple Counter</h1>
      <div>
        <input type="text" value={$counterName} onChange={onChange} />
        <button onClick={create}>create</button>
      </div>
      <div className="counters">
        {exists &&
          $counters.map((counter, index) => (
            <div className="counter" key={index}>
              <span>{counter.name}</span>
              <span>{counter.count}</span>
              <span>{counter.lastUpdate}</span>
              {/* <button onClick={increment} style={{marginLeft: '8px'}}>+1</button> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
