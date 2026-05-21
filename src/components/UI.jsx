

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button className={`${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export const Card = ({ children, title }) => {
  return (
    <div className="card">
      {title && <h3 className="text-xl font-serif text-primary mb-6 border-b border-gray-100 pb-3 font-semibold tracking-wide">{title}</h3>}
      {children}
    </div>
  )
}

export const Badge = ({ children, variant = 'success' }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger'
  }
  
  return <span className={variants[variant]}>{children}</span>
}

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="label-field">{label}</label>}
      <input className="input-field" {...props} />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

export const Select = ({ label, options, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="label-field">{label}</label>}
      <select className="input-field" {...props}>
        <option value="">Sélectionner...</option>
        {options?.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.code || opt.libelle || opt.nom || opt.numeroPasseport}</option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export const Table = ({ columns, data, onView, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune donnée</div>
  }

  return (
    <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-slate-50 border-b-2 border-slate-200">
            {columns.map(col => (
              <th key={col.key} className="text-left px-6 py-4 font-bold text-primary uppercase text-xs tracking-wider">
                {col.label}
              </th>
            ))}
            {(onView || onEdit || onDelete) && <th className="text-left px-6 py-4 font-bold text-primary uppercase text-xs tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-gray-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {(onView || onEdit || onDelete) && (
                <td className="px-4 py-3 space-x-2">
                  {onView && <button onClick={() => onView(row)} className="text-green-600 hover:underline">Voir</button>}
                  {onEdit && <button onClick={() => onEdit(row)} className="text-blue-600 hover:underline">Éditer</button>}
                  {onDelete && <button onClick={() => onDelete(row.id)} className="text-red-600 hover:underline">Supprimer</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
