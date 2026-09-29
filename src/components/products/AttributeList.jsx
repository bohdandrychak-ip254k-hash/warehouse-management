export default function AttributeList({ attributes }) {
  const entries = Object.entries(attributes ?? {})

  if (entries.length === 0) {
    return null
  }

  return (
    <dl className="attribute-list">
      {entries.map(([label, value]) => (
        <div className="attribute-row" key={label}>
          <dt>{label}</dt>
          <dd>{String(value)}</dd>
        </div>
      ))}
    </dl>
  )
}