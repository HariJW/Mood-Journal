import { Routes, Route } from "react-router-dom";
import { AllNotesPage, MoodSelectorPage } from "./pages";
import "./App.css"

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MoodSelectorPage />} />
        <Route path="/notes" element={<AllNotesPage />} />
      </Routes>
    </div>
  );
}

export default App;
