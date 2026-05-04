import React from 'react'
import { Card } from '../components/UI'

export const DocumentationPage = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-serif text-primary tracking-tight mb-2 drop-shadow-sm">
          Documentation Officielle
        </h1>
        <p className="text-gray-600 text-lg font-light">
          Textes de références, statuts légaux et manuels des procédures du Registre des Demandes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="📜 Textes de loi & Régulations">
          <ul className="space-y-3 text-sm text-gray-700 leading-relaxed font-light">
            <li className="flex items-start">
              <span className="text-secondary mr-2">♦</span>
              <span><strong>Décret 2024-001 :</strong> Relatif aux conditions d'octroi de visas touristiques.</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">♦</span>
              <span><strong>Loi 2023-018 :</strong> Sur le statut des résidents de long terme et les critères d'éligibilité.</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">♦</span>
              <span><strong>Circulaire n°42 :</strong> Modalités de contrôle des pièces justificatives.</span>
            </li>
          </ul>
        </Card>

        <Card title="📖 Manuel des Procédures">
          <ul className="space-y-3 text-sm text-gray-700 leading-relaxed font-light">
            <li className="flex items-start">
              <span className="text-secondary mr-2">♦</span>
              <span><strong>Création d'un dossier :</strong> Le demandeur doit d'abord être enregistré dans le Registre Citoyen.</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">♦</span>
              <span><strong>Validation des objets métier :</strong> Un passeport valide doit être renseigné pour toute demande de visa.</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">♦</span>
              <span><strong>Approbation finale :</strong> Après validation de toutes les pièces, la demande passe en "En cours d'analyse" puis "Approuvée".</span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center mt-12">
        <h3 className="text-xl font-serif text-primary mb-4">Besoin d'assistance ?</h3>
        <p className="text-gray-600 font-light mb-6">
          Contactez le service informatique ou le responsable du registre consulaire pour toute question technique.
        </p>
        <button className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-semibold tracking-wide uppercase text-sm">
          Faire une demande d'assistance
        </button>
      </div>
    </div>
  )
}
