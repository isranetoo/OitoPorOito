
import App from './App';


import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import RatingsPlayers from './pages/RatingsPlayers';
import PlayComputer from './pages/PlayComputer';
import Play from './pages/Play';
import Chessnews from './pages/Chessnews';
import ChessSocial from './pages/ChessSocial';
import LearnChess from './pages/LearnChess';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/ratings-players' element={<RatingsPlayers />} />
        <Route path='/play-computer' element={<PlayComputer />} />
        <Route path='/play' element={<Play />} />
        <Route path='/chessnews' element={<Chessnews />} />
        <Route path='/social' element={<ChessSocial />} />
        <Route path="/learn-chess" element={<LearnChess />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
