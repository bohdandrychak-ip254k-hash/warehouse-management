export default function AppButton({ children, type = 'button', disabled = false }) {
  return (
    <button type={type} className="app-button" disabled={disabled}>
      {children}
    </button>
  )
}