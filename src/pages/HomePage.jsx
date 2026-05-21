import { Link } from 'react-router-dom'
import { Card } from '../components/UI'

export const HomePage = () => {
  return (
    <div className="space-y-12">
      <div className="text-center py-10 border-b border-gray-200 px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-primary tracking-tight mb-4 drop-shadow-sm">
          Portail Administratif
        </h1>
        <p className="text-gray-600 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Système sécurisé de gestion des demandes administratives <br/>(visas, résidences, passeports)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card title="👤 Registre Citoyen">
          <p className="text-gray-600 mb-6 font-light leading-relaxed">Administration et suivi des informations personnelles des demandeurs.</p>
          <Link to="/demandeurs" className="inline-block border-b-2 border-secondary text-primary font-medium hover:text-secondary hover:border-primary transition-all pb-1 uppercase text-sm tracking-wider">
            Consulter les registres →
          </Link>
        </Card>

        <Card title="📝 Dossiers & Demandes">
          <p className="text-gray-600 mb-6 font-light leading-relaxed">Création, évaluation et validation formelle des dossiers de demande.</p>
          <Link to="/demandes" className="inline-block border-b-2 border-secondary text-primary font-medium hover:text-secondary hover:border-primary transition-all pb-1 uppercase text-sm tracking-wider">
            Gérer les dossiers →
          </Link>
        </Card>

        <Card title="📋 Documentation Officielle">
          <p className="text-gray-600 mb-6 font-light leading-relaxed">Textes de référence, procédures et manuels d&apos;utilisation du système.</p>
          <Link to="/documentation" className="inline-block border-b-2 border-secondary text-primary font-medium hover:text-secondary hover:border-primary transition-all pb-1 uppercase text-sm tracking-wider">
            Accéder à la base →
          </Link>
        </Card>
      </div>

      <div className="bg-primary text-white rounded-xl shadow-lg p-10 relative overflow-hidden mt-8 border-l-4 border-secondary">
        <div className="absolute top-0 right-0 opacity-10 text-9xl -mt-8 -mr-8 font-serif">V</div>
        <h3 className="text-2xl font-serif text-secondary mb-6 truncate tracking-wide">Capacités du Système</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-slate-300 font-light tracking-wide">
          <li className="flex items-center"><span className="text-secondary mr-3 text-lg">♦</span> Traitement hautement sécurisé</li>
          <li className="flex items-center"><span className="text-secondary mr-3 text-lg">♦</span> Validation automatisée des dossiers</li>
          <li className="flex items-center"><span className="text-secondary mr-3 text-lg">♦</span> Numérisation des pièces justificatives</li>
          <li className="flex items-center"><span className="text-secondary mr-3 text-lg">♦</span> Intégration des statuts administratifs</li>
          <li className="flex items-center"><span className="text-secondary mr-3 text-lg">♦</span> Tableau de bord temps réel</li>
        </ul>
      </div>
    </div>
  )
}
