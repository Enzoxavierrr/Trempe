import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Reserva } from './pages/Reserva';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/reservar" element={<Reserva />} />
    </Routes>
  );
}
