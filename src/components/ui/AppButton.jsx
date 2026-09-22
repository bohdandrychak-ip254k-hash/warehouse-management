import Button from 'react-bootstrap/Button'

export default function AppButton({ children, type = 'button', disabled = false }) {
  return (
    <Button type={type} variant="primary" disabled={disabled}>
      {children}
    </Button>
  )
}