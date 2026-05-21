import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { demandeAPI, pieceAPI, referenceAPI } from '../services/api'
import { Button, Card, Badge, Input, Select, Modal, Table } from '../components/UI'
import { useNotification, Notification } from '../hooks/useNotification'
import { QRCodeSVG } from 'qrcode.react'
import PhotoCapture from '../components/PhotoCapture'
import SignaturePad from '../components/SignaturePad'
// const shareUrl = window.location.href.replace('localhost', '10.142.60.162');

export const DemandeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [demande, setDemande] = useState(null)
  const [validation, setValidation] = useState(null)
  const [pieces, setPieces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPieceModal, setShowPieceModal] = useState(false)
  const [mediaModal, setMediaModal] = useState({ open: false, type: null, mode: 'view' })
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
      const formData = new FormData()
      formData.append('file', pieceForm.file)
      formData.append('demandeurId', demande.demandeurId)
      formData.append('categoriePieceId', pieceForm.categoriePieceId)
      formData.append('valide', pieceForm.valide ? 'true' : 'false')

      await pieceAPI.upload(formData)
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

  const handleViewPiece = (piece) => {
    window.open(pieceAPI.getFileUrl(piece.id), '_blank', 'noopener,noreferrer')
  }

  const handleViewResumePdf = () => {
    window.open(demandeAPI.getResumePdfUrl(id), '_blank', 'noopener,noreferrer')
  }

  const handleViewAccusePdf = () => {
    window.open(demandeAPI.getAccusePdfUrl(id), '_blank', 'noopener,noreferrer')
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

  const openMediaModal = (type, mode) => {
    setMediaModal({ open: true, type, mode })
  }

  const closeMediaModal = () => {
    setMediaModal({ open: false, type: null, mode: 'view' })
  }

  const mediaConfig = {
    photo: {
      title: 'Photo',
      path: demande.photoPath,
      alt: 'Demandeur',
      viewUrl: `/api/uploads/photo/${id}`,
      component: (
        <PhotoCapture
          demandeId={id}
          onPhotoUpload={() => {
            fetchData()
            closeMediaModal()
          }}
        />
      )
    },
    signature: {
      title: 'Signature',
      path: demande.signaturePath,
      alt: 'Signature',
      viewUrl: `/api/uploads/signature/${id}`,
      component: (
        <SignaturePad
          demandeId={id}
          onSignatureUpload={() => {
            fetchData()
            closeMediaModal()
          }}
        />
      )
    }
  }

const pieceColumns = [
  {
    key: 'fichierPath',
    label: 'Fichier',
    render: (row) => row.fichierPath?.split('/').pop() || row.fichierPath
  },
  { key: 'categoriePiece', label: 'Catégorie' }, 
  { key: 'dateUpload', label: 'Date Upload' },
  { 
    key: 'valide', 
    label: 'Statut',
    render: (row) => <Badge variant={row.valide ? 'success' : 'danger'}>{row.valide ? 'Validée' : 'Non validée'}</Badge>
  }
]

// const shareUrl = window.location.href.replace('localhost', '10.142.60.162');
const currentIP = window.location.hostname;
const shareUrl = `http://${currentIP}:5173/demandes/${id}`;


  return (
    <div>
      <Notification notification={notification} />
      <button onClick={() => navigate('/demandes')} className="mb-6 text-secondary hover:text-primary transition-colors font-semibold tracking-wide uppercase text-sm">← Retour aux Demandes</button>

      <div className="mb-4 flex gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={handleViewResumePdf}>
          Voir PDF résumé
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={handleViewAccusePdf}>
          Voir accusé de réception
        </Button>
      </div>

      {/* Affichage du QR Code dans un petit encadré */}
      <div className="bg-white p-2 border rounded-lg shadow-sm flex flex-col items-center">
        <QRCodeSVG value={shareUrl} size={80} />
        <span className="text-[10px] text-gray-500 mt-1">Scanner pour mobile</span>
      </div>

      <Card title={`Demande #${demande.id}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {['photo', 'signature'].map((type) => {
          const config = mediaConfig[type]
          const hasMedia = Boolean(config.path)

          return (
            <Card key={type} title={type === 'photo' ? '📷 Photo' : '✍️ Signature'}>
              <div className="space-y-4">
                <div className="min-h-28 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {hasMedia ? (
                    <img
                      src={config.viewUrl}
                      alt={config.alt}
                      className="max-h-40 w-full object-contain"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">Aucune {config.title.toLowerCase()} enregistrée</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => openMediaModal(type, 'view')}
                  >
                    Voir
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => openMediaModal(type, 'edit')}
                  >
                    Éditer
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card title="Pièces Justificatives" className="mt-6">
        <Button onClick={() => setShowPieceModal(true)} variant="success" size="sm" className="mb-4">
          + Ajouter Pièce
        </Button>
        <Table 
          columns={pieceColumns}
          data={pieces}
          onView={handleViewPiece}
          onDelete={handleDeletePiece}
          loading={false}
        />
      </Card>

      <Modal
        isOpen={mediaModal.open}
        onClose={closeMediaModal}
        title={mediaModal.type ? `${mediaConfig[mediaModal.type].title} - ${mediaModal.mode === 'view' ? 'Voir' : 'Éditer'}` : 'Média'}
      >
        {mediaModal.type && (
          <div className="space-y-4">
            {mediaModal.mode === 'view' ? (
              mediaConfig[mediaModal.type].path ? (
                <div className="flex justify-center">
                  <img
                    src={mediaConfig[mediaModal.type].viewUrl}
                    alt={mediaConfig[mediaModal.type].alt}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  Aucune {mediaConfig[mediaModal.type].title.toLowerCase()} disponible.
                </p>
              )
            ) : (
              mediaConfig[mediaModal.type].component
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={showPieceModal} onClose={() => setShowPieceModal(false)} title="Ajouter Pièce">
        <form onSubmit={handleAddPiece} className="space-y-4">
          <Input
            label="Fichier justificatif"
            type="file"
            onChange={(e) => setPieceForm({ ...pieceForm, file: e.target.files?.[0] || null })}
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