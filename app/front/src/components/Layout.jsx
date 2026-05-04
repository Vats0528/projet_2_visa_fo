import React from 'react'
import { Link } from 'react-router-dom'

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              📋 Gestion Demandes
            </Link>
            <ul className="flex space-x-6">
              <li><Link to="/" className="hover:text-blue-200">Accueil</Link></li>
              <li><Link to="/demandeurs" className="hover:text-blue-200">Demandeurs</Link></li>
              <li><Link to="/demandes" className="hover:text-blue-200">Demandes</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
