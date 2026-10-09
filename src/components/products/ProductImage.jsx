import { useState } from 'react'

export default function ProductImage({ productId, name }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className="product-image product-image-placeholder"
        role="img"
        aria-label={`Зображення товару «${name}» відсутнє`}
      >
        Немає зображення
      </div>
    )
  }

  return (
    <img
      className="product-image"
      src={`/images/products/${productId}.jpg`}
      alt={name}
      onError={() => setFailed(true)}
    />
  )
}