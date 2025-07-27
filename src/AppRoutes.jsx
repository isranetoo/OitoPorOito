
import App from './App';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RatingsPlayers from './pages/RatingsPlayers';


import PlayComputer from './pages/PlayComputer';
import PlayGame from './pages/PlayGame';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/ratings-players' element={<RatingsPlayers />} />
        <Route path='/play-computer' element={<PlayComputer />} />
        <Route path='/play-game' element={<PlayGame />} />
        
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
