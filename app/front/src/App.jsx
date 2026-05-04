import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { DemandeurListPage } from './pages/DemandeurListPage'
import { DemandeListPage } from './pages/DemandeListPage'
import { DemandeDetailPage } from './pages/DemandeDetailPage'
import { DemandeurDetailPage } from './pages/DemandeurDetailPage'
import { DocumentationPage } from './pages/DocumentationPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demandeurs" element={<DemandeurListPage />} />
          <Route path="/demandeurs/:id" element={<DemandeurDetailPage />} />
          <Route path="/demandes" element={<DemandeListPage />} />
          <Route path="/demandes/:id" element={<DemandeDetailPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
