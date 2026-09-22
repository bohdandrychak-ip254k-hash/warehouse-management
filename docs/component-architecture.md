# Компонентна архітектура

## Ієрархія компонентів

App
└─ AppLayout                      (children = вміст сторінки)
   ├─ SiteHeader
   │  └─ MainNav
   ├─ [сторінка через children]
   │  HomePage
   │  ├─ Section title="Про застосунок"
   │  └─ Section title="Каталог товарів"
   │     ├─ CatalogSummary
   │     └─ ProductList
   │        ├─ EmptyState                (якщо товарів немає)
   │        └─ ProductCard × N
   │           └─ AvailabilityBadge
   ├─ [друга сторінка]
   │  OrderPage
   │  └─ Section title="Оформлення замовлення"
   │     └─ FormField × N
   └─ підвал (залишається прямо в AppLayout — короткий, без окремої поведінки)

## Контракти props

| Компонент | Props | Тип | Призначення |
|---|---|---|---|
| `AppLayout` | `children` | ReactNode | Вміст сторінки, що вставляється між шапкою й підвалом |
| `SiteHeader` | `title` | string | Назва застосунку в шапці |
| `SiteHeader` | `links` | Array<{label, href}> | Передається в `MainNav` |
| `MainNav` | `links` | Array<{label, href}> | Список пунктів навігації |
| `Section` | `title` | string | Заголовок блоку |
| `Section` | `children` | ReactNode | Вміст блоку (композиція) |
| `EmptyState` | `message` | string | Текст, коли даних немає |
| `CatalogSummary` | `total` | number | Кількість товарів у каталозі |
| `CatalogSummary` | `caption` | string (необов'язковий) | Підпис лічильника, значення за замовчуванням |
| `ProductList` | `items` | Array<Product> | Уже збагачені товари (з `categoryName`, `sectionName`) |
| `ProductCard` | `item` | Product | Один товар для відображення |
| `AvailabilityBadge` | `quantity` | number | Лише кількість — не весь товар, щоб компонент можна було використати і в картці, і в `OrderPage` |

## Напрям залежностей

Сторінки (`HomePage`, `OrderPage`) імпортують предметні (`ProductCard`, `AvailabilityBadge`) і спільні (`Section`, `FormField`) компоненти. Спільні компоненти нічого не імпортують ні зі сторінок, ні з файлів даних — це дозволяє замінити джерело даних (Л 3.2) без переписування UI.