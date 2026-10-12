import { Link, useNavigate, useSearchParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import useProductSelection from '../hooks/useProductSelection.js'
import useOrders from '../hooks/useOrders.js'
import OrderEditor from './OrderEditor.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import OrderFormCreatePage from './OrderFormCreatePage.jsx'
import { parseIdList } from '../utils/parseIdList.js'

export default function OrderCreatePage({ catalog, suppliers }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { selectedId, clearSelection } = useProductSelection()
  const { createOrder } = useOrders()
  const productId = searchParams.get('productId')
  
      if (searchParams.has('products')) {
        const productIds = parseIdList(searchParams.get('products'))
        const unknownIds = productIds.filter((id) => !catalog.some((item) => item.id === id))

        if (productIds.length === 0 || unknownIds.length > 0) {
          return (
            <NotFoundPage
              title="Неможливо підготувати форму"
              message="Один чи кілька товарів із параметра products відсутні в каталозі."
              backTo="/orders/restock"
              backLabel="До списку поповнення"
            />
          )
        }

            // Форма може бути без постачальника; порожній параметр — те саме, що його відсутність.
    const supplierParam = searchParams.get('supplier')
    let supplier = null

    if (supplierParam) {
      supplier = suppliers.find((entry) => entry.id === supplierParam) ?? null
      if (!supplier) {
        return (
          <NotFoundPage
            title="Неможливо підготувати форму"
            message="Постачальника з параметра supplier немає в довіднику."
            backTo="/orders/restock"
            backLabel="До списку поповнення"
          />
        )
      }

      const notSupplied = productIds
        .map((id) => catalog.find((item) => item.id === id))
        .filter((item) => !(item.supplierIds ?? []).includes(supplier.id))
      if (notSupplied.length > 0) {
        return (
          <NotFoundPage
            title="Неможливо підготувати форму"
            message={`Постачальник «${supplier.name}» не постачає: ${notSupplied.map((item) => item.name).join('; ')}.`}
            backTo={`/orders/restock?${new URLSearchParams({ supplier: supplier.id })}`}
            backLabel="До списку поповнення"
          />
        )
      }
    }

    return (
      <OrderFormCreatePage catalog={catalog} supplier={supplier} productIds={productIds} />
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