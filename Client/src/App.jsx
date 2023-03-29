import { useState } from "react";
import {
  Navbar,
  Welcome,
  Footer,
  Service,
  Transaction,
  Loader,
} from "./components";
import "./App.css";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar></Navbar>
        <Welcome></Welcome>
      </div>
      <Service />
      <Transaction />
      <Footer />
    </div>
  );
};

export default App;
