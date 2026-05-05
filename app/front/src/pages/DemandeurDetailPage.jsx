import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Badge, Input, Select, Modal, Table } from '../components/UI'
import { demandeurAPI, objetMetierAPI, pieceAPI, referenceAPI } from '../services/api'
import { useNotification, Notification } from '../hooks/useNotification'

export const DemandeurDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { notification, notify } = useNotification()

  const [loading, setLoading] = useState(true)
  const [demandeur, setDemandeur] = useState(null)
  const [documents, setDocuments] = useState({
    passeports: [],
    visas: [],
    visaTransformables: [],
    pieces: []
  })
  const [references, setReferences] = useState({})
  const [showPasseportModal, setShowPasseportModal] = useState(false)
  const [showVisaModal, setShowVisaModal] = useState(false)
  const [showVisaTransformableModal, setShowVisaTransformableModal] = useState(false)
  const [showPieceModal, setShowPieceModal] = useState(false)
  const [passeportForm, setPasseportForm] = useState({})
  const [visaForm, setVisaForm] = useState({})
  const [visaTransformableForm, setVisaTransformableForm] = useState({
    numeroVisa: '',
    reference: '',
    dateDelivrance: '',
    dateExpiration: '',
    passeportId: ''
  })
  const [pieceForm, setPieceForm] = useState({})

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [demandeurRes, passeportsRes, visasRes, visaTransformablesRes, piecesRes, categoriesRes, typesVisaRes] = await Promise.all([
        demandeurAPI.getById(id),
        objetMetierAPI.getPasseports(id),
        objetMetierAPI.getVisas(id),
        objetMetierAPI.getVisaTransformables(id),
        pieceAPI.getAll(id),
        referenceAPI.getCategoriesPieces(),
        referenceAPI.getTypesVisa()
      ])

      setDemandeur(demandeurRes.data)
      setDocuments({
        passeports: passeportsRes.data,
        visas: visasRes.data,
        visaTransformables: visaTransformablesRes.data,
        pieces: piecesRes.data
      })
      setReferences({
        categories: categoriesRes.data,
        typesVisa: typesVisaRes.data
      })
    } catch (error) {
      notify('Erreur lors du chargement du demandeur', 'error')
    } finally {
      setLoading(false)
    }
  }

  const submitPasseport = async (event) => {
    event.preventDefault()
    try {
      await objetMetierAPI.createPasseport({ ...passeportForm, demandeurId: Number(id) })
      setPasseportForm({})
      setShowPasseportModal(false)
      notify('Passeport ajouté', 'success')
      fetchData()
    } catch (error) {
      notify('Erreur lors de l’ajout du passeport', 'error')
    }
  }

  const submitVisa = async (event) => {
    event.preventDefault()
    try {
      await objetMetierAPI.createVisa({ ...visaForm, demandeurId: Number(id) })
      setVisaForm({})
      setShowVisaModal(false)
      notify('Visa ajouté', 'success')
      fetchData()
    } catch (error) {
      notify('Erreur lors de l’ajout du visa', 'error')
    }
  }

  const submitVisaTransformable = async (event) => {
    event.preventDefault()
    try {
      await objetMetierAPI.createVisaTransformable({ ...visaTransformableForm, demandeurId: Number(id) })
      setVisaTransformableForm({})
      setShowVisaTransformableModal(false)
      notify('Visa transformable ajouté', 'success')
      fetchData()
    } catch (error) {
      notify('Erreur lors de l’ajout du visa transformable', 'error')
    }
  }

  const submitPiece = async (event) => {
    event.preventDefault()
    try {
      await pieceAPI.create({ ...pieceForm, demandeurId: Number(id) })
      setPieceForm({})
      setShowPieceModal(false)
      notify('Pièce ajoutée', 'success')
      fetchData()
    } catch (error) {
      notify('Erreur lors de l’ajout de la pièce', 'error')
    }
  }

  const deletePiece = async (pieceId) => {
    if (!window.confirm('Supprimer cette pièce ?')) return
    try {
      await pieceAPI.delete(pieceId)
      notify('Pièce supprimée', 'success')
      fetchData()
    } catch (error) {
      notify('Erreur lors de la suppression de la pièce', 'error')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (!demandeur) {
    return <div className="text-center py-8">Demandeur introuvable</div>
  }

const pieceColumns = [
  {
    key: 'fichierPath',
    label: 'Fichier',
    render: (row) => {
      const fileUrl = `/document_demandeur/${row.fichierPath}`;

      return (
        <div className="d-flex align-items-center gap-3">
          {/* le chemin du fichier */}
          <span>{row.fichierPath}</span>

          {/* bouton voir */}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <button className="btn btn-primary btn-sm">
              👁 Voir
            </button>
          </a>
        </div>
      );
    }
  },

  { key: 'categoriePiece', label: 'Catégorie' },
  { key: 'dateUpload', label: 'Date upload' },

  {
    key: 'valide',
    label: 'Statut',
    render: (row) => (
      <Badge variant={row.valide ? 'success' : 'danger'}>
        {row.valide ? 'Validée' : 'En attente'}
      </Badge>
    )
  }
];

  const passeportColumns = [
    { key: 'numeroPasseport', label: 'Numéro' },
    { key: 'dateDelivrance', label: 'Délivrance' },
    { key: 'dateExpiration', label: 'Expiration' }
  ]

  const visaColumns = [
    { key: 'numeroVisa', label: 'Numéro' },
    { key: 'reference', label: 'Référence' },
    { key: 'typeVisa', label: 'Type' },
    { key: 'dateDelivrance', label: 'Délivrance' },
    { key: 'dateExpiration', label: 'Expiration' }
  ]

  const visaTransformableColumns = [
    { key: 'numeroVisa', label: 'Numéro' },
    {
      key: 'passeportId',
      label: 'Passeport',
      render: (row) => {
        const passeport = documents.passeports.find((item) => item.id === row.passeportId)
        return passeport ? passeport.numeroPasseport : row.passeportId
      }
    }
  ]

  return (
    <div>
      <Notification notification={notification} />
      <button onClick={() => navigate('/demandeurs')} className="mb-6 text-secondary hover:text-primary transition-colors font-semibold tracking-wide uppercase text-sm">
        ← Retour au Registre
      </button>

      <Card title={`Demandeur #${demandeur.id}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Nom complet</p>
            <p className="text-lg font-semibold">{demandeur.nom} {demandeur.prenom}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Naissance</p>
            <p className="text-lg font-semibold">{demandeur.dateNaissance || 'Non renseignée'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Lieu de naissance</p>
            <p className="text-lg font-semibold">{demandeur.lieuNaissance || 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Situation familiale</p>
            <p className="text-lg font-semibold">{demandeur.situationFamiliale}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Nationalité</p>
            <p className="text-lg font-semibold">{demandeur.nationalite}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        <Card title="Passeports">
          <Button onClick={() => setShowPasseportModal(true)} variant="success" size="sm" className="mb-4">
            + Ajouter passeport
          </Button>
          <Table columns={passeportColumns} data={documents.passeports} />
        </Card>

        <Card title="Visa (non transformable)">
          <Button onClick={() => setShowVisaModal(true)} variant="success" size="sm" className="mb-4">
            + Ajouter visa
          </Button>
          <Table columns={visaColumns} data={documents.visas} />
        </Card>

        <Card title="Visa transformable">
          <Button onClick={() => setShowVisaTransformableModal(true)} variant="success" size="sm" className="mb-4">
            + Ajouter visa transformable
          </Button>
          <Table columns={visaTransformableColumns} data={documents.visaTransformables} />
        </Card>

        <Card title="Pièces justificatives">
          <Button onClick={() => setShowPieceModal(true)} variant="success" size="sm" className="mb-4">
            + Ajouter pièce
          </Button>
          <Table columns={pieceColumns} data={documents.pieces} onDelete={deletePiece} />
        </Card>
      </div>

      <Modal isOpen={showPasseportModal} onClose={() => setShowPasseportModal(false)} title="Ajouter un passeport">
        <form onSubmit={submitPasseport} className="space-y-4">
          <Input
            label="Numéro de passeport"
            value={passeportForm.numeroPasseport || ''}
            onChange={(event) => setPasseportForm({ ...passeportForm, numeroPasseport: event.target.value })}
            required
          />
          <Input
            label="Date de délivrance"
            type="date"
            value={passeportForm.dateDelivrance || ''}
            onChange={(event) => setPasseportForm({ ...passeportForm, dateDelivrance: event.target.value })}
          />
          <Input
            label="Date d'expiration"
            type="date"
            value={passeportForm.dateExpiration || ''}
            onChange={(event) => setPasseportForm({ ...passeportForm, dateExpiration: event.target.value })}
          />
          <div className="flex space-x-4">
            <Button type="submit" variant="primary">Sauvegarder</Button>
            <Button type="button" variant="secondary" onClick={() => setShowPasseportModal(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showVisaModal} onClose={() => setShowVisaModal(false)} title="Ajouter un visa">
        <form onSubmit={submitVisa} className="space-y-4">
          <Input
            label="Numéro de visa"
            value={visaForm.numeroVisa || ''}
            onChange={(event) => setVisaForm({ ...visaForm, numeroVisa: event.target.value })}
            required
          />
          <Input
            label="Référence"
            value={visaForm.reference || ''}
            onChange={(event) => setVisaForm({ ...visaForm, reference: event.target.value })}
          />
          <Input
            label="Nom"
            value={visaForm.nom || ''}
            onChange={(event) => setVisaForm({ ...visaForm, nom: event.target.value })}
          />
          <Input
            label="Prénom"
            value={visaForm.prenom || ''}
            onChange={(event) => setVisaForm({ ...visaForm, prenom: event.target.value })}
          />
          <Input
            label="Date de délivrance"
            type="date"
            value={visaForm.dateDelivrance || ''}
            onChange={(event) => setVisaForm({ ...visaForm, dateDelivrance: event.target.value })}
          />
          <Input
            label="Date d'expiration"
            type="date"
            value={visaForm.dateExpiration || ''}
            onChange={(event) => setVisaForm({ ...visaForm, dateExpiration: event.target.value })}
          />
          <Input
            label="Date de modification"
            value={visaForm.dateModification || ''}
            onChange={(event) => setVisaForm({ ...visaForm, dateModification: event.target.value })}
          />
          <Select
            label="Type de visa"
            options={references.typesVisa || []}
            value={visaForm.typeVisaId || ''}
            onChange={(event) => setVisaForm({ ...visaForm, typeVisaId: Number(event.target.value) })}
            required
          />
          <div className="flex space-x-4">
            <Button type="submit" variant="primary">Sauvegarder</Button>
            <Button type="button" variant="secondary" onClick={() => setShowVisaModal(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showVisaTransformableModal} onClose={() => setShowVisaTransformableModal(false)} title="Ajouter un visa transformable">
        <form onSubmit={submitVisaTransformable} className="space-y-4">
          <Input
            label="Numéro de visa"
            value={visaTransformableForm.numeroVisa || ''}
            onChange={(event) => setVisaTransformableForm({ ...visaTransformableForm, numeroVisa: event.target.value })}
            required
          />
          <Input
              label="Référence"
              value={visaTransformableForm.reference || ''}
              onChange={(event) =>
                setVisaTransformableForm({ ...visaTransformableForm, reference: event.target.value })
              }
            />
            <Input
              label="Date de délivrance"
              type="date"
              value={visaTransformableForm.dateDelivrance || ''}
              onChange={(event) =>
                setVisaTransformableForm({ ...visaTransformableForm, dateDelivrance: event.target.value })
              }
            />
            <Input
              label="Date d'expiration"
              type="date"
              value={visaTransformableForm.dateExpiration || ''}
              onChange={(event) =>
                setVisaTransformableForm({ ...visaTransformableForm, dateExpiration: event.target.value })
              }
            />
          <Select
            label="Passeport source"
            options={documents.passeports || []}
            value={visaTransformableForm.passeportId || ''}
            onChange={(event) => setVisaTransformableForm({ ...visaTransformableForm, passeportId: Number(event.target.value) })}
            required
          />
          <div className="flex space-x-4">
            <Button type="submit" variant="primary">Sauvegarder</Button>
            <Button type="button" variant="secondary" onClick={() => setShowVisaTransformableModal(false)}>Annuler</Button>
          </div>

        </form>
      </Modal>

      <Modal isOpen={showPieceModal} onClose={() => setShowPieceModal(false)} title="Ajouter une pièce">
        <form onSubmit={submitPiece} className="space-y-4">
          <Input
            label="Chemin du fichier"
            value={pieceForm.fichierPath || ''}
            onChange={(event) => setPieceForm({ ...pieceForm, fichierPath: event.target.value })}
            required
          />
          <Select
            label="Catégorie"
            options={references.categories || []}
            value={pieceForm.categoriePieceId || ''}
            onChange={(event) => setPieceForm({ ...pieceForm, categoriePieceId: Number(event.target.value) })}
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={pieceForm.valide || false}
              onChange={(event) => setPieceForm({ ...pieceForm, valide: event.target.checked })}
            />
            <span>Pièce validée</span>
          </label>
          <div className="flex space-x-4">
            <Button type="submit" variant="primary">Sauvegarder</Button>
            <Button type="button" variant="secondary" onClick={() => setShowPieceModal(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}