import InStock from "./pages/Instock";
import OutofStockcard from "./pages/Outofstock";
import FuturePrediction from "./pages/Futureprediction";
import LogIn from "./pages/LogIn";
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Category from './pages/Category';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        
        <Route path="/login" element={<LogIn />} />
        
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category" element={<Category />} />
            <Route path="/in-stock" element={<InStock />} />
            <Route path="/out-of-stock" element={<OutofStockcard />} />
            <Route path="/future-prediction" element={<FuturePrediction />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;