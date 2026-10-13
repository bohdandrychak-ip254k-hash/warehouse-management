import { useNavigate } from 'react-router'
import useOrders from '../hooks/useOrders.js'
import { isInTransit } from '../domain/stock.js'
import OrderFormEditor from './OrderFormEditor.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function OrderFormEditPage({ order, catalog, suppliers }) {
  const navigate = useNavigate()
  const { updateOrder } = useOrders()
  const detailsPath = `/orders/${encodeURIComponent(order.id)}`

  const supplier = order.supplierId === null
    ? null
    : suppliers.find((entry) => entry.id === order.supplierId)

  if (supplier === undefined) {
    return (
      <NotFoundPage
        title="Постачальника замовлення немає в довіднику"
        message="Форма посилається на постачальника, якого немає в довіднику."
        backTo={detailsPath}
        backLabel="До замовлення"
      />
    )
  }

  const missing = order.items.some((item) => !catalog.some((product) => product.id === item.productId))
  if (missing) {
    return (
      <NotFoundPage
        title="Товар замовлення відсутній"
        message="Форма містить товар, якого немає в каталозі."
        backTo={detailsPath}
        backLabel="До замовлення"
      />
    )
  }


  const ownQuantities = new Map(
    isInTransit(order) ? order.items.map((item) => [item.productId, item.quantity]) : [],
  )
  const initialEntries = Object.fromEntries(
    order.items.map((item) => [item.productId, { ...item }]),
  )

  function handleSave(items) {
    const result = updateOrder(order.id, { items })
    if (result.ok) {
      navigate(`/orders/${encodeURIComponent(result.record.id)}`, { replace: true })
    }
    return result
  }

  return (
    <OrderFormEditor
      key={`edit-${order.id}`}
      title={`Редагування форми ${order.id}`}
      supplier={supplier}
      suppliers={suppliers}
      products={catalog}
      initialQueue={order.items.map((item) => item.productId)}
      initialEntries={initialEntries}
      allowAdd
      supplierNote="Постачальника форми змінити не можна."
      backLink={{ to: detailsPath, label: 'До замовлення' }}
      otherOrderedFor={(product) => Math.max(0, (product.ordered ?? 0) - (ownQuantities.get(product.id) ?? 0))}
      doneText="Перегляньте внесені позиції праворуч: їх можна відредагувати, видалити, а нові товари додати нижче. Коли все готово, збережіть зміни."
      cancelMessage="Вийти без збереження? Незбережені зміни буде втрачено."
      onSave={handleSave}
      onCancel={() => navigate(detailsPath)}
      submitLabel="Зберегти зміни"
      cancelLabel="Вийти без збереження"
    />
  )
}