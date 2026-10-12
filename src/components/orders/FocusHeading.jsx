import { useEffect, useRef } from 'react'

export default function FocusHeading({ id, focus = false, children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (focus) {
      ref.current?.focus()
    }
  }, [focus])

  return <h2 id={id} ref={ref} tabIndex={-1}>{children}</h2>
}