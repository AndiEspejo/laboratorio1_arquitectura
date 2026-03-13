import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold tracking-wide">BancoUdeA</h1>
      <div className="flex gap-6">
        <Link to="/" className="text-blue-200 hover:text-white font-medium transition-colors">Clientes</Link>
        <Link to="/transfer" className="text-blue-200 hover:text-white font-medium transition-colors">Transferencias</Link>
        <Link to="/history" className="text-blue-200 hover:text-white font-medium transition-colors">Historial</Link>
      </div>
    </nav>
  );
}

export default Navbar;
