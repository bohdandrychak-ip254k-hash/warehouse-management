import { Link, useNavigate, useParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import AvailabilityBadge from '../components/products/AvailabilityBadge.jsx'
import AttributeList from '../components/products/AttributeList.jsx'
import ProductImage from '../components/products/ProductImage.jsx'
import SalesChart from '../components/products/SalesChart.jsx'
import useProductSelection from '../hooks/useProductSelection.js'
import NotFoundPage from './NotFoundPage.jsx'
import { sales } from '../data/sales.js'

export default function ProductDetailsPage({ catalog }) {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { selectProduct } = useProductSelection()
  const product = catalog.find((item) => item.id === productId)

  if (!product) {
  return (
    <NotFoundPage
      title="Товар не знайдено"
      message={`У каталозі немає товару з ідентифікатором «${productId}».`}
      backTo="/products"
      backLabel="Повернутися до каталогу"
    />
  )
}

  const productSales = sales.filter((sale) => sale.productId === product.id)

  function handlePrepareOrder() {
    selectProduct(product.id)
    const search = new URLSearchParams({ productId: product.id })
    navigate(`/orders/new?${search}`)
  }

  return (
    <section>
      <Link to="/products" className="back-link">← До каталогу без фільтрів</Link>
      <PageHeading title={product.name} />

      <div className="product-details">
        <ProductImage key={product.id} productId={product.id} name={product.name} />
        <div>
          <p className="path">{product.sectionName} / {product.categoryName}</p>
          <p className="barcode">Штрихкод: {product.barcode}</p>
          <p>Кількість: {product.quantity} {product.unit}</p>
          <AvailabilityBadge quantity={product.quantity} />
          <AppButton onClick={handlePrepareOrder}>Підготувати замовлення</AppButton>
        </div>
      </div>

      <h2>Характеристики</h2>
      <AttributeList attributes={product.attributes} />

      <h2>Опис</h2>
      <p>{product.description}</p>

      <h2>Продажі</h2>
      <SalesChart sales={productSales} unit={product.unit} />
    </section>
  )
}