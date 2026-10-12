export const sections = [
  { id: 'sec-1', name: 'Електроніка' },
  { id: 'sec-2', name: 'Канцтовари' },
  { id: 'sec-3', name: 'Книги' },
]

export const categories = [
  { id: 'cat-1', name: 'Ноутбуки' },
  { id: 'cat-2', name: 'Ручки' },
  { id: 'cat-3', name: 'Зошити' },
  { id: 'cat-4', name: 'Фантастика' },
  { id: 'cat-5', name: 'Художні' },
]

export const products = [
  {
    id: 'prod-001', barcode: '4820001000012', name: 'Ноутбук Lenovo ThinkPad',
    categoryId: 'cat-1', sectionId: 'sec-1', quantity: 12, unit: 'шт.',
    attributes: { "Оперативна пам'ять": '16GB', Процесор: 'Intel Core i7', Екран: '15.6"' },
    description: '14" ноутбук для офісних завдань, SSD 512 ГБ.',
  },
  {
    id: 'prod-002', barcode: '4820002000029', name: 'Ручка кулькова синя',
    categoryId: 'cat-2', sectionId: 'sec-2', quantity: 3, unit: 'упак.',
    attributes: { Колір: 'синій', 'Товщина лінії': '0.7 мм', Чорнило: 'олійне' },
    description: 'Упаковка 10 шт., чорнило на масляній основі.',
  },
  {
    id: 'prod-003', barcode: '4820003000036', name: 'Роман "Дюна"',
    categoryId: 'cat-4', sectionId: 'sec-3', quantity: 0, unit: 'шт.',
    attributes: { Сторінок: 412, Обкладинка: 'тверда', Мова: 'українська' },
    description: 'Фантастичний роман Френка Герберта, видання 2021 року.',
  },
  {
    id: 'prod-004', barcode: '4820004000043', name: 'Зошит 48 арк., клітинка',
    categoryId: 'cat-3', sectionId: 'sec-2', quantity: 2, unit: 'упак.',
    attributes: { Аркушів: 48, Лінія: 'клітинка', Обкладинка: "м'яка" },
    description: 'Упаковка 10 зошитів, офсетний папір.',
  },
  {
    id: 'prod-005', barcode: '4820005000050', name: 'Роман "Гобіт"',
    categoryId: 'cat-4', sectionId: 'sec-3', quantity: 4, unit: 'шт.',
    attributes: { Сторінок: 310, Обкладинка: 'тверда', Мова: 'українська' },
    description: 'Фентезі Дж. Р. Р. Толкіна, видання 2020 року.',
  },
  {
    id: 'prod-006', barcode: '4820006000067', name: 'Збірка поезій "Кобзар"',
    categoryId: 'cat-5', sectionId: 'sec-3', quantity: 25, unit: 'шт.',
    attributes: { Сторінок: 640, Обкладинка: 'тверда', Мова: 'українська' },
    description: 'Збірка творів Т. Шевченка.',
  },
]