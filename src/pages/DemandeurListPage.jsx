import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { demandeurAPI, referenceAPI } from '../services/api'
import { Button, Card, Input, Select, Modal, Table } from '../components/UI'
import { useNotification, Notification } from '../hooks/useNotification'

export const DemandeurListPage = () => {
  const [demandeurs, setDemandeurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDemandeur, setSelectedDemandeur] = useState(null)
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
      const [demandeurRes, situationsRes, nationalitesRes] = await Promise.all([
        demandeurAPI.getAll(),
        referenceAPI.getSituationsFamiliales(),
        referenceAPI.getNationalites()
      ])
      
      setDemandeurs(demandeurRes.data)
      setReferences({
        situations: situationsRes.data,
        nationalites: nationalitesRes.data
      })
    } catch (error) {
      notify('Erreur lors du chargement', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedDemandeur(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (demandeur) => {
    setSelectedDemandeur(demandeur)
    setFormData(demandeur)
    setShowModal(true)
  }

  const handleView = (demandeur) => {
    navigate(`/demandeurs/${demandeur.id}`)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression?')) return
    try {
      await demandeurAPI.delete(id)
      setDemandeurs(demandeurs.filter(d => d.id !== id))
      notify('Demandeur supprimé avec succès', 'success')
    } catch (error) {
      notify('Erreur lors de la suppression', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedDemandeur) {
        await demandeurAPI.update(selectedDemandeur.id, formData)
        setDemandeurs(demandeurs.map(d => d.id === selectedDemandeur.id ? { ...formData, id: selectedDemandeur.id } : d))
        notify('Demandeur mis à jour', 'success')
      } else {
        const res = await demandeurAPI.create(formData)
        setDemandeurs([...demandeurs, res.data])
        notify('Demandeur créé avec succès', 'success')
      }
      setShowModal(false)
    } catch (error) {
      notify('Erreur lors de la sauvegarde', 'error')
    }
  }

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'dateNaissance', label: 'Date Naissance' },
    { key: 'lieuNaissance', label: 'Lieu Naissance' },
    { key: 'situationFamilialeLibelle', label: 'Situation Familiale' },
    { key: 'nationaliteLibelle', label: 'Nationalité' }
  ]

  return (
    <div>
      <Notification notification={notification} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-primary drop-shadow-sm">Registre des Demandeurs</h1>
        <Button onClick={handleAdd} variant="primary" className="w-full md:w-auto">+ Ajouter Demandeur</Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={demandeurs} 
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedDemandeur ? 'Éditer Demandeur' : 'Nouveau Demandeur'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom"
            value={formData.nom || ''}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <Input
            label="Prénom"
            value={formData.prenom || ''}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            required
          />
          <Input
            label="Date Naissance"
            type="date"
            value={formData.dateNaissance || ''}
            onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
            required
          />
          <Input
            label="Lieu Naissance"
            value={formData.lieuNaissance || ''}
            onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
            required
          />
          <Select
            label="Situation Familiale"
            options={references.situations || []}
            value={formData.situationFamilialeId || ''}
            onChange={(e) => setFormData({ ...formData, situationFamilialeId: parseInt(e.target.value) })}
            required
          />
          <Select
            label="Nationalité"
            options={references.nationalites || []}
            value={formData.nationaliteId || ''}
            onChange={(e) => setFormData({ ...formData, nationaliteId: parseInt(e.target.value) })}
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
