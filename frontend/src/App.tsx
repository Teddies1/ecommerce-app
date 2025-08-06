import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import socketService from './services/socket';
import './App.css';

function App() {
  useEffect(() => {
    socketService.connect();

    socketService.onOrderCompleted((order) => {
      toast.success(`Order #${order.id} has been completed!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });

    socketService.onOrderFailed((order) => {
      toast.error(`Order #${order.id} failed to process`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
