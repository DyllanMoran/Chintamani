import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Colby from './pages/Colby'
import Tools from './pages/Tools'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colby" element={<Colby />} />
        <Route path="/tools" element={<Tools />} />
      </Routes>
      <footer />
    </>
  )
}
