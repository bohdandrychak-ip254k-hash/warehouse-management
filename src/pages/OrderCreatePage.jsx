import { Link, useNavigate, useSearchParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import useProductSelection from '../hooks/useProductSelection.js'
import OrderEditor from './OrderEditor.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function OrderCreatePage({ catalog }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { selectedId, clearSelection } = useProductSelection()
  const productId = searchParams.get('productId')

  if (productId === null) {
    const lastSelectionSearch = selectedId
      ? `?${new URLSearchParams({ productId: selectedId })}`
      : null

    return (
      <>
        <PageHeading title="Нове замовлення" />
        <EmptyState message="Спочатку виберіть товар.">
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

  function handleCancel() {
    clearSelection()
    navigate('/products', { replace: true })
  }

  return (
    <OrderEditor
      key={`new-${product.id}`}
      title="Нове замовлення"
      product={product}
      onCancel={handleCancel}
      cancelLabel="Скасувати чернетку й очистити вибір"
    />
  )
}