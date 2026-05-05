
import { Link } from 'react-router-dom'

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-primary text-white shadow-xl border-b-2 border-secondary relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="text-3xl font-serif tracking-widest text-secondary drop-shadow">
              <span className="text-white font-bold">VISA</span> SYSTEM
            </Link>
            <ul className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-semibold uppercase tracking-wider">
              <li><Link to="/" className="hover:text-secondary transition-colors duration-200">Accueil</Link></li>
              <li><Link to="/demandeurs" className="hover:text-secondary transition-colors duration-200">Demandeurs</Link></li>
              <li><Link to="/demandes" className="hover:text-secondary transition-colors duration-200">Demandes</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {children}
      </main>
      <footer className="bg-primary text-slate-400 py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Réseaux Diplomatiques. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
