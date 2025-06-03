import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
