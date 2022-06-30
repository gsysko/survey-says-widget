import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const[question, setQuestion] = useState("Yes or no?")
  const handleSubmit= (e: React.FormEvent) => {
    parent?.postMessage?.({ pluginMessage: { type: 'edit', question: question } }, "*")
    e.preventDefault();
  }

  useEffect(() => {
    if (typeof parent !== undefined) {
      parent?.postMessage?.({ pluginMessage: "hello" }, "*");
    }
  }, []);

  return (
    <div className="App">
      <form onSubmit={e => handleSubmit(e)}>
        <label>
          Question: 
          <input type="text" value={question} onChange={e => setQuestion(e.target.value)} />
        </label>
        <input type="submit" value="Save" />
      </form>
    </div>
  );
}

export default App;
