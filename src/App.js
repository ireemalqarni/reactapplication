import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Products from "./pages/ProductList";
import Admin from "./pages/Admin";
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {

 const handleCreateUser =() =>{

 };

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="registration" element={<Registration onCreatedUser={handleCreateUser} />} />
            <Route path="Login" element={<Login />} />
            <Route path="products" element={<Products />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </div>
  ); // return
}

export default App;
