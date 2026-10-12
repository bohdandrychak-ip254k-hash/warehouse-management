export const orders = [
  {
    id: 'ord-001',
    date: '2026-10-01',
    status: 'Нове',
    kind: 'single',
    supplierId: null,
    items: [
      { productId: 'prod-002', quantity: 30, comment: 'Терміново: залишок нижче мінімуму.' },
    ],
  },
  {
    id: 'ord-002',
    date: '2026-09-24',
    status: 'Надіслано',
    kind: 'form',
    supplierId: 'sup-001',
    items: [
      { productId: 'prod-003', quantity: 15, comment: '' },
      { productId: 'prod-006', quantity: 5, comment: 'Для виставки.' },
    ],
  },
  {
    id: 'ord-003',
    date: '2026-09-10',
    status: 'Отримано',
    kind: 'single',
    supplierId: null,
    items: [
      { productId: 'prod-001', quantity: 5, comment: 'Планове поповнення.' },
    ],
  },
]