import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import {Button} from './components/ui/button.tsx'
import AHTOptimizationMVP  from './modules/AHTOptimizationMVP.jsx'
import IVRDemo  from './modules/IVRDemo.jsx'
import ContactCenterUI from './modules/ContactCenterUI.jsx'

function Navigation() {
  const location = useLocation()
  
  return (
    <div className='flex items-center justify-center gap-4'>
      <Link to="/">
        <Button 
          className='cursor-pointer' 
          variant={location.pathname === '/ivr' ? 'default' : 'ghost'} 
          size="sm"
        >
          IVR
        </Button>
      </Link>
      <Link to="/contact-center">
        <Button 
          className='cursor-pointer' 
          variant={location.pathname === '/contact-center' ? 'default' : 'ghost'} 
          size="sm"
        >
          Contact Center
        </Button>
      </Link>
      <Link to="/aht-optimizer">
        <Button 
          className='cursor-pointer' 
          variant={location.pathname === '/aht-optimizer' ? 'default' : 'ghost'} 
          size="sm"
        >
          AHT Optimizer
        </Button>
      </Link>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<IVRDemo />} />
        <Route path="/ivr" element={<IVRDemo />} />
        <Route path="/contact-center" element={<ContactCenterUI />} />
        <Route path="/aht-optimizer" element={<AHTOptimizationMVP />} />
      </Routes>
    </Router>
  )
}

export default App
