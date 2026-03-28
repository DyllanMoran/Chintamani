import { NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function Nav() {
  const [wardOpen, setWardOpen] = useState(false)
  const groupRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) {
        setWardOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header>
      <nav>
        <NavLink to="/" className="site-title">Chintamani</NavLink>
        <ul>
          <li><NavLink to="/dark-materials">Dark Materials</NavLink></li>
          <li className={`nav-group${wardOpen ? ' open' : ''}`} ref={groupRef}>
            <button
              className="nav-group-label"
              onClick={() => setWardOpen(o => !o)}
              aria-expanded={wardOpen}
            >
              Ward of Remembering
            </button>
            <ul className="nav-dropdown">
              <li>
                <NavLink to="/colby" onClick={() => setWardOpen(false)}>
                  Colby
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  )
}
