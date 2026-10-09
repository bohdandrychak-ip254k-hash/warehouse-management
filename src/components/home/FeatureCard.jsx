import { Link } from 'react-router'

export default function FeatureCard({ icon, title, description, to, comingSoon }) {
  const content = (
    <>
      <span className="feature-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {comingSoon && <span className="feature-badge">Незабаром</span>}
    </>
  )

  if (comingSoon || !to) {
    return (
      <div className="feature-card feature-card-soon" aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <Link to={to} className="feature-card feature-card-active">
      {content}
    </Link>
  )
}