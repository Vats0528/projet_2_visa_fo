import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { demandeAPI, referenceAPI, demandeurAPI, objetMetierAPI } from '../services/api'
import { Button, Card, Badge, Input, Select, Modal, Table } from '../components/UI'
import { useNotification, Notification } from '../hooks/useNotification'

export const DemandeListPage2 = () => {
  const [demandes, setDemandes] = useState([])
  const [demandeurs, setDemandeurs] = useState([])
  const [allPasseports, setAllPasseports] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDemande, setSelectedDemande] = useState(null)
  const [formData, setFormData] = useState({})
  const [references, setReferences] = useState({})
  const { notification, notify } = useNotification()
  const navigate = useNavigate()

  // Filtres
  const [filterId, setFilterId] = useState('')
  const [filterPassport, setFilterPassport] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // 1. Chargement des données de base
      const [demandesRes, demandeursRes, typesRes, statusRes, typesVisaRes] = await Promise.all([
        demandeAPI.getAll(),
        demandeurAPI.getAll(),
        referenceAPI.getTypeDemandes(),
        referenceAPI.getStatusDemandes(),
        referenceAPI.getTypesVisa()
      ])
      
      const listeDemandeurs = demandeursRes.data

      // 2. Chargement des passeports pour chaque demandeur (car pas de getAllPasseports)
      const passeportsPromesses = listeDemandeurs.map(d => 
        objetMetierAPI.getPasseports(d.id)
      )
      const passeportsResultats = await Promise.all(passeportsPromesses)
      const tousLesPasseports = passeportsResultats.flatMap(res => res.data)

      setDemandes(demandesRes.data)
      setDemandeurs(listeDemandeurs)
      setAllPasseports(tousLesPasseports)
      setReferences({
        types: typesRes.data,
        statuses: statusRes.data,
        typesVisa: typesVisaRes.data
      })
    } catch (error) {
      console.error(error)
      notify('Erreur lors du chargement des données', 'error')
    } finally {
      setLoading(false)
    }
  }

  // --- Logique de filtrage ---
  const filteredDemandes = useMemo(() => {
    return demandes.filter(demande => {
      // Filtre par ID Demandeur
      const matchId = filterId === '' || 
                      demande.demandeurId.toString().includes(filterId)

      // Filtre par Passeport (en cherchant dans la liste globale récupérée)
      const matchPassport = filterPassport === '' || (
        allPasseports.some(p => 
          p.demandeurId === demande.demandeurId && 
          p.numeroPasseport.toLowerCase().includes(filterPassport.toLowerCase())
        )
      )

      return matchId && matchPassport
    })
  }, [demandes, allPasseports, filterId, filterPassport])

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

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return
    try {
      await demandeAPI.delete(id)
      setDemandes(demandes.filter(d => d.id !== id))
      notify('Demande supprimée', 'success')
    } catch (error) {
      notify('Erreur lors de la suppression', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedDemande) {
        await demandeAPI.update(selectedDemande.id, formData)
        notify('Demande mise à jour', 'success')
      } else {
        await demandeAPI.create(formData)
        notify('Demande créée', 'success')
      }
      fetchData()
      setShowModal(false)
    } catch (error) {
      notify('Erreur lors de l\'enregistrement', 'error')
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
    { key: 'demandeurId', label: 'ID Demandeur' },
    { key: 'nomDemandeur', label: 'Nom Demandeur' },
    { 
      key: 'numeroPasseport', 
      label: 'Passeport',
      render: (row) => {
        const pass = allPasseports.find(p => p.demandeurId === row.demandeurId)
        return pass ? pass.numeroPasseport : <span className="text-gray-400">N/A</span>
      }
    },
    { key: 'typeDemande', label: 'Type' },
    { 
      key: 'statusLibelle', 
      label: 'Statut',
      render: (row) => <Badge variant={getStatusColor(row.statusId)}>{row.statusLibelle}</Badge>
    },
    { key: 'dateCreation', label: 'Date' }
  ]

  const selectedType = references.types?.find(t => t.id === formData.typeDemandeId)
  const needsVisa = selectedType?.code === 'NOUVEAU_TITRE'

  return (
    <div className="container mx-auto p-4">
      <Notification notification={notification} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Demandes</h1>
        <Button onClick={handleAdd} variant="primary">+ Nouvelle Demande</Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Rechercher par ID Demandeur"
            placeholder="Ex: 1"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
          />
          <Input 
            label="Rechercher par N° Passeport"
            placeholder="Ex: TANA123..."
            value={filterPassport}
            onChange={(e) => setFilterPassport(e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          data={filteredDemandes} 
          onView={(d) => navigate(`/demandes/${d.id}`)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedDemande ? 'Modifier' : 'Ajouter'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Demandeur"
            options={demandeurs.map(d => ({ value: d.id, label: `${d.nom} ${d.prenom} (ID: ${d.id})` }))}
            value={formData.demandeurId || ''}
            onChange={(e) => setFormData({ ...formData, demandeurId: parseInt(e.target.value) })}
            required
          />
          
          <Select
            label="Type de Demande"
            options={references.types || []}
            value={formData.typeDemandeId || ''}
            onChange={(e) => setFormData({ ...formData, typeDemandeId: parseInt(e.target.value) })}
            required
          />

          {needsVisa && (
            <Select
              label="Type de Visa"
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

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" variant="primary">Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}