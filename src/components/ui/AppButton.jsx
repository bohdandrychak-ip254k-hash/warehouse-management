export default function AppButton({
  children,
  type = 'button',
  variant = 'primary',
  size = 'normal',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
  'aria-haspopup': ariaHaspopup,
}) {
  const sizeClass = size === 'small' ? ' app-button-small' : ''

  return (
    <button
      type={type}
      className={`app-button app-button-${variant}${sizeClass}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-haspopup={ariaHaspopup}
    >
      {children}
    </button>
  )
}