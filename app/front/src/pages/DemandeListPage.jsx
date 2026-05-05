import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { demandeAPI, referenceAPI, demandeurAPI } from '../services/api'
import { Button, Card, Badge, Select, Modal, Table } from '../components/UI'
import { useNotification, Notification } from '../hooks/useNotification'

export const DemandeListPage = () => {
  const [demandes, setDemandes] = useState([])
  const [demandeurs, setDemandeurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDemande, setSelectedDemande] = useState(null)
  const [formData, setFormData] = useState({})
  const [references, setReferences] = useState({})
  const { notification, notify } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [demandesRes, demandeurRes, typesRes, statusRes, typesVisaRes] = await Promise.all([
        demandeAPI.getAll(),
        demandeurAPI.getAll(),
        referenceAPI.getTypeDemandes(),
        referenceAPI.getStatusDemandes(),
        referenceAPI.getTypesVisa()
      ])
      
      setDemandes(demandesRes.data)
      setDemandeurs(demandeurRes.data)
      setReferences({
        types: typesRes.data,
        statuses: statusRes.data,
        typesVisa: typesVisaRes.data
      })
    } catch (error) {
      notify('Erreur lors du chargement', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedDemande(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (demande) => {
    setSelectedDemande(demande)
    setFormData(demande)
    setShowModal(true)
  }

  const selectedTypeDemande = references.types?.find((type) => type.id === formData.typeDemandeId)
  const needsVisaType = selectedTypeDemande?.code === 'NOUVEAU_TITRE'

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression?')) return
    try {
      await demandeAPI.delete(id)
      setDemandes(demandes.filter(d => d.id !== id))
      notify('Demande supprimée', 'success')
    } catch (error) {
      notify('Erreur lors de la suppression', 'error')
    }
  }

  const handleViewDetails = (demande) => {
    navigate(`/demandes/${demande.id}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedDemande) {
        await demandeAPI.update(selectedDemande.id, formData)
        fetchData()
        notify('Demande mise à jour', 'success')
      } else {
        await demandeAPI.create(formData)
        fetchData()
        notify('Demande créée', 'success')
      }
      setShowModal(false)
    } catch (error) {
      notify('Erreur lors de la sauvegarde', 'error')
    }
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

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nomDemandeur', label: 'Demandeur' },
    { key: 'typeDemande', label: 'Type de demande' },
    { 
      key: 'statusLibelle', 
      label: 'Statut',
      render: (row) => <Badge variant={getStatusColor(row.statusId)}>{row.statusLibelle}</Badge>
    },
    { key: 'dateCreation', label: 'Date Création' }
  ]

  return (
    <div>
      <Notification notification={notification} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-primary drop-shadow-sm">Gestion des Demandes</h1>
        <Button onClick={handleAdd} variant="primary" className="w-full md:w-auto">+ Nouvelle Demande</Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={demandes} 
          onView={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedDemande ? 'Éditer Demande' : 'Nouvelle Demande'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Demandeur"
            options={demandeurs}
            value={formData.demandeurId || ''}
            onChange={(e) => setFormData({ ...formData, demandeurId: parseInt(e.target.value) })}
            required
          />
          <Select
            label="Type de Demande"
            options={references.types || []}
            value={formData.typeDemandeId || ''}
            onChange={(e) => {
              const typeDemandeId = parseInt(e.target.value)
              const nextTypeDemande = references.types?.find((type) => type.id === typeDemandeId)
              setFormData({
                ...formData,
                typeDemandeId,
                typeVisaId: nextTypeDemande?.code === 'NOUVEAU_TITRE' ? formData.typeVisaId : undefined
                
              })
            }}
            required
          />
          {needsVisaType && (
            <Select
              label="Type de visa"
              options={references.typesVisa || []}
              value={formData.typeVisaId || ''}
              onChange={(e) => setFormData({ ...formData, typeVisaId: parseInt(e.target.value) })}
              required
            />
          )}
          <Select
            label="Statut"
            options={references.statuses || []}
            value={formData.statusId || ''}
            onChange={(e) => setFormData({ ...formData, statusId: parseInt(e.target.value) })}
            required
          />
          <div className="flex space-x-4">
            <Button type="submit" variant="primary">Sauvegarder</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
