export const sections = [
  { id: 'sec-1', name: 'Електроніка' },
  { id: 'sec-2', name: 'Канцтовари' },
  { id: 'sec-3', name: 'Книги' },
]

export const categories = [
  { id: 'cat-1', name: 'Ноутбуки', sectionId: 'sec-1' },
  { id: 'cat-2', name: 'Ручки', sectionId: 'sec-2' },
  { id: 'cat-3', name: 'Зошити', sectionId: 'sec-2' },
  { id: 'cat-4', name: 'Фантастика', sectionId: 'sec-3' },
  { id: 'cat-5', name: 'Художні', sectionId: 'sec-3' },
]

export const products = [
  {
    id: 'prod-001',
    barcode: '4820001000012',
    name: 'Ноутбук Lenovo ThinkPad',
    categoryId: 'cat-1',
    quantity: 12,
    unit: 'шт.',
    supplier: 'ТОВ "Техно Плюс"',
  },
  {
    id: 'prod-002',
    barcode: '4820002000029',
    name: 'Ручка кулькова синя',
    categoryId: 'cat-2',
    quantity: 3,
    unit: 'упак.',
    supplier: 'ФОП Іванов',
  },
  {
    id: 'prod-003',
    barcode: '4820003000036',
    name: 'Роман "Дюна"',
    categoryId: 'cat-4',
    quantity: 0,
    unit: 'шт.',
    supplier: 'Видавництво "Клуб"',
  },
]