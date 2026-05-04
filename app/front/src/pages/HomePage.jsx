import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/UI'

export const HomePage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Bienvenue
        </h1>
        <p className="text-gray-600 text-lg">
          Système de gestion des demandes administratives (visa, résidence, passeport)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="👤 Demandeurs">
          <p className="text-gray-600 mb-4">Gérez les demandeurs et leurs informations personnelles</p>
          <Link to="/demandeurs" className="text-blue-600 hover:underline">Voir les demandeurs →</Link>
        </Card>

        <Card title="📝 Demandes">
          <p className="text-gray-600 mb-4">Créez et suivez les demandes administratives</p>
          <Link to="/demandes" className="text-blue-600 hover:underline">Voir les demandes →</Link>
        </Card>

        <Card title="📋 Documentation">
          <p className="text-gray-600 mb-4">Consultez la documentation du système</p>
          <a href="#" className="text-blue-600 hover:underline">Lire la doc →</a>
        </Card>
      </div>

      <Card title="Fonctionnalités" className="mt-8">
        <ul className="space-y-2 text-gray-700">
          <li>✓ CRUD complet pour demandeurs et demandes</li>
          <li>✓ Gestion des pièces justificatives</li>
          <li>✓ Validation automatique des dossiers</li>
          <li>✓ Gestion des objets métier (passeport, visa, etc.)</li>
          <li>✓ Interface responsive et professionnelle</li>
        </ul>
      </Card>
    </div>
  )
}
