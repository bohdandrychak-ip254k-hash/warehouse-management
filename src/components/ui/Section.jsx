export default function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <h2 id={id ? `${id}-title` : undefined}>{title}</h2>
      {children}
    </section>
  )
}