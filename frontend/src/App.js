import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Lifecycle from "./Components/Lifecycle";
import Obstacles from "./Components/Obstacles";
import Tracking from "./Components/Tracking";
import "./App.css";
import {Route,Routes,} from 'react-router-dom';

function App() {
  return (

    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Navbar" element={<Navbar/>} />
        <Route path="/Lifecycle" element={<Lifecycle/>} />
        <Route path="/Obstacles" element={<Obstacles/>} />
        <Route path="/Tracking" element={<Tracking/>} />
      </Routes>
    </>
  );
}

export default App;
