import useOrders from '../../hooks/useOrders.js'
import AppButton from '../ui/AppButton.jsx'

export default function OrderNotice() {
  const { notice, dismissNotice } = useOrders()

  return (
    <div className={notice ? 'operation-notice has-notice' : 'operation-notice'}>
      <p role="status">{notice}</p>
      {notice && (
        <AppButton variant="secondary" size="small" onClick={dismissNotice}>
          Закрити повідомлення
        </AppButton>
      )}
    </div>
  )
}