import { Link, useNavigate, useSearchParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import useProductSelection from '../hooks/useProductSelection.js'
import useOrders from '../hooks/useOrders.js'
import OrderEditor from './OrderEditor.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function OrderCreatePage({ catalog }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { selectedId, clearSelection } = useProductSelection()
  const { createOrder } = useOrders()
  const productId = searchParams.get('productId')
  
    if (searchParams.has('products')) {
    return (
      <>
        <PageHeading title="Нова форма замовлення" />
        <EmptyState message="Майстер форми ще не підключено.">
          <p><Link to="/orders/restock">Повернутися до списку поповнення</Link></p>
        </EmptyState>
      </>
    )
  }

  if (productId === null) {
    const lastSelectionSearch = selectedId
      ? `?${new URLSearchParams({ productId: selectedId })}`
      : null

    return (
      <>
        <PageHeading title="Нове замовлення" />
        <EmptyState message="Спочатку виберіть товар.">
          <p><Link to="/orders/restock">Відкрити список поповнення</Link></p>
          <p><Link to="/products">Відкрити каталог</Link></p>
          <p><Link to="/products">Відкрити каталог</Link></p>
          {lastSelectionSearch && (
            <p>
              <Link to={lastSelectionSearch}>Використати останній вибір</Link>
            </p>
          )}
        </EmptyState>
      </>
    )
  }

  const product = catalog.find((item) => item.id === productId)

  if (!product) {
    return (
      <NotFoundPage
        title="Неможливо підготувати замовлення"
        message="Товар із параметра productId відсутній у каталозі."
        backTo="/products"
        backLabel="До каталогу"
      />
    )
  }

  function handleSave(input) {
    const result = createOrder({ kind: 'single', supplierId: null, items: [input] })
    if (result.ok) {
      navigate(`/orders/${encodeURIComponent(result.record.id)}`, { replace: true })
    }
    return result
  }

  function handleCancel() {
    clearSelection()
    navigate('/products', { replace: true })
  }

  return (
    <OrderEditor
      key={`new-${product.id}`}
      title="Нове замовлення"
      product={product}
      onSave={handleSave}
      submitLabel="Створити замовлення"
      onCancel={handleCancel}
      cancelLabel="Скасувати чернетку й очистити вибір"
    />
  )
}