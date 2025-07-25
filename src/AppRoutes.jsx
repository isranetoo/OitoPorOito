
import App from './App';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RatingsPlayers from './pages/RatingsPlayers';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/ratings-players' element={<RatingsPlayers />} />
      </Routes>
    </BrowserRouter>
  );
}
