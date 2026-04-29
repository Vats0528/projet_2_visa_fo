import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { demandeAPI, pieceAPI, referenceAPI } from '../services/api'
import { Button, Card, Badge, Input, Select, Modal, Table } from '../components/UI'
import { useNotification, Notification } from '../hooks/useNotification'

export const DemandeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [demande, setDemande] = useState(null)
  const [validation, setValidation] = useState(null)
  const [pieces, setPieces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPieceModal, setShowPieceModal] = useState(false)
  const [pieceForm, setPieceForm] = useState({})
  const [references, setReferences] = useState({})
  const { notification, notify } = useNotification()

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [demandeRes, validationRes, piecesRes, categoriesRes] = await Promise.all([
        demandeAPI.getById(id),
        demandeAPI.validate(id),
        pieceAPI.getAll(),
        referenceAPI.getCategoriesPieces()
      ])
      
      setDemande(demandeRes.data)
      setValidation(validationRes.data)
      setPieces(piecesRes.data.filter(p => p.demandeurId === demandeRes.data.demandeurId))
      setReferences({ categories: categoriesRes.data })
    } catch (error) {
      notify('Erreur lors du chargement', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPiece = async (e) => {
    e.preventDefault()
    try {
      await pieceAPI.create({
        ...pieceForm,
        demandeurId: demande.demandeurId
      })
      fetchData()
      setPieceForm({})
      setShowPieceModal(false)
      notify('Pièce ajoutée', 'success')
    } catch (error) {
      notify('Erreur lors de l\'ajout', 'error')
    }
  }

  const handleDeletePiece = async (pieceId) => {
    if (!window.confirm('Supprimer cette pièce?')) return
    try {
      await pieceAPI.delete(pieceId)
      fetchData()
      notify('Pièce supprimée', 'success')
    } catch (error) {
      notify('Erreur lors de la suppression', 'error')
    }
  }

  if (loading || !demande) {
    return <div className="text-center py-8">Chargement...</div>
  }

  const getStatusColor = (status) => {
    const colors = {
      'DEMANDE_CREE': 'warning',
      'EN_COURS_ANALYSE': 'warning',
      'DOCUMENTS_MANQUANTS': 'danger',
      'DOCUMENTS_VALIDES': 'success',
      'REFUSEE': 'danger',
      'APPROUVEE': 'success'
    }
    return colors[status] || 'warning'
  }

  const pieceColumns = [
    { key: 'fichierPath', label: 'Fichier' },
    { key: 'categoriePieceLibelle', label: 'Catégorie' },
    { key: 'dateUpload', label: 'Date Upload' },
    { 
      key: 'valide', 
      label: 'Statut',
      render: (row) => <Badge variant={row.valide ? 'success' : 'danger'}>{row.valide ? 'Validée' : 'Non validée'}</Badge>
    }
  ]

  return (
    <div>
      <Notification notification={notification} />
      <button onClick={() => navigate('/demandes')} className="mb-4 text-blue-600 hover:underline">← Retour</button>

      <Card title={`Demande #${demande.id}`}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Demandeur</p>
            <p className="text-lg font-semibold">{demande.demandeurNom || demande.demandeurId}</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <p className="text-lg font-semibold">{demande.typeDemande}</p>
          </div>
          {demande.typeVisa && (
            <div>
              <p className="text-gray-600">Type de visa</p>
              <p className="text-lg font-semibold">{demande.typeVisa}</p>
            </div>
          )}
          <div>
            <p className="text-gray-600">Statut</p>
            <Badge variant={getStatusColor(demande.statusId)}>{demande.status}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Date Création</p>
            <p className="text-lg">{new Date(demande.dateCreation).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </Card>

      {validation && (
        <Card title="Validation" className="mt-6">
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Statut Global</p>
              <Badge variant={validation.valide ? 'success' : 'danger'}>
                {validation.valide ? 'Complète ✓' : 'Incomplète'}
              </Badge>
            </div>

            {validation.piecesManquantes && validation.piecesManquantes.length > 0 && (
              <div>
                <p className="font-semibold text-red-600 mb-2">Pièces Manquantes:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validation.piecesManquantes.map((piece, idx) => (
                    <li key={idx} className="text-red-600">{piece}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.objetsManquants && validation.objetsManquants.length > 0 && (
              <div>
                <p className="font-semibold text-red-600 mb-2">Objets Manquants:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validation.objetsManquants.map((objet, idx) => (
                    <li key={idx} className="text-red-600">{objet}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card title="Pièces Justificatives" className="mt-6">
        <Button onClick={() => setShowPieceModal(true)} variant="success" size="sm" className="mb-4">
          + Ajouter Pièce
        </Button>
        <Table 
          columns={pieceColumns}
          data={pieces}
          onDelete={handleDeletePiece}
          loading={false}
        />
      </Card>

      <Modal isOpen={showPieceModal} onClose={() => setShowPieceModal(false)} title="Ajouter Pièce">
        <form onSubmit={handleAddPiece} className="space-y-4">
          <Input
            label="Chemin du Fichier"
            value={pieceForm.fichierPath || ''}
            onChange={(e) => setPieceForm({ ...pieceForm, fichierPath: e.target.value })}
            required
          />
          <Select
            label="Catégorie"
            options={references.categories || []}
            value={pieceForm.categoriePieceId || ''}
            onChange={(e) => setPieceForm({ ...pieceForm, categoriePieceId: parseInt(e.target.value) })}
            required
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={pieceForm.valide || false}
              onChange={(e) => setPieceForm({ ...pieceForm, valide: e.target.checked })}
              className="mr-2"
            />
            <span>Validée</span>
          </label>
          <div className="flex space-x-4">
            <Button type="submit" variant="primary">Ajouter</Button>
            <Button type="button" variant="secondary" onClick={() => setShowPieceModal(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
