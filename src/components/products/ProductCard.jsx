import { useState } from 'react'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import AttributeList from './AttributeList.jsx'
import AppButton from '../ui/AppButton.jsx'
import Modal from '../ui/Modal.jsx'

export default function ProductCard({ item }) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <article className="product-card">
      <h3>{item.name}</h3>
      <p className="path">{item.sectionName} / {item.categoryName}</p>
      <p className="barcode">Штрихкод: {item.barcode}</p>
      <p>Кількість: {item.quantity} {item.unit}</p>
      <AvailabilityBadge quantity={item.quantity} />

      <AppButton
        variant="secondary"
        aria-haspopup="dialog"
        onClick={() => setDetailsOpen(true)}
      >
        Детальніше
      </AppButton>

      {detailsOpen && (
        <Modal title={item.name} onClose={() => setDetailsOpen(false)}>
          <AttributeList attributes={item.attributes} />
          <p className="modal-description">{item.description}</p>
        </Modal>
      )}
    </article>
  )
}