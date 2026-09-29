import { useState } from 'react'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import AttributeList from './AttributeList.jsx'
import AppButton from '../ui/AppButton.jsx'
import Modal from '../ui/Modal.jsx'

export default function ProductCard({ item, selected, onSelect }) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <article className="product-card">
      <h3>{item.name}</h3>
      <p className="path">{item.sectionName} / {item.categoryName}</p>
      <p className="barcode">Штрихкод: {item.barcode}</p>
      <p>Кількість: {item.quantity} {item.unit}</p>
      <AvailabilityBadge quantity={item.quantity} />

      <div className="card-actions">
        <AppButton variant="secondary" aria-haspopup="dialog" onClick={() => setDetailsOpen(true)}>
          Детальніше
        </AppButton>

        <AppButton aria-pressed={selected} onClick={() => onSelect(item.id)}>
          {selected ? 'Обрано' : 'Обрати для замовлення'}
        </AppButton>
      </div>

      {selected && <p className="selection-note">Додано до замовлення нижче.</p>}

      {detailsOpen && (
        <Modal title={item.name} onClose={() => setDetailsOpen(false)}>
          <AttributeList attributes={item.attributes} />
          <p className="modal-description">{item.description}</p>
        </Modal>
      )}
    </article>
  )
}