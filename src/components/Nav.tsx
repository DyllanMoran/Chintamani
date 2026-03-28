import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <header>
      <nav>
        <NavLink to="/" className="site-title">Chintamani</NavLink>
        <ul>
          <li><NavLink to="/colby">Colby</NavLink></li>
          <li><NavLink to="/tools">Tools</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}
