import Admin from "./AdminDashboard.jsx";
import Users from "./Users.jsx";
import {Routes,Route} from "react-router-dom";
import ProductList from "./ProductList.jsx";
import Product from "./Product.jsx";
import Auth from "./Authform.jsx";
function App() {
  

  return (
    <>
      <div>
        <Routes>
          <Route  path="/users" element={<Users/>}/>
        <Route  path="/order" element={<Admin/>}/>
     <Route  path="/" element={<Auth/>}/>
        <Route  path="/products" element={<ProductList/>}/>
    <Route  path="/add-product" element={<Product/>}/>
          
        </Routes>
        
        
</div>
    </>
  )
}

export default App
