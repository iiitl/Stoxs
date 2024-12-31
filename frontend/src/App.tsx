import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar';
function App() {
  return  (
    <div className='bg-custom'>
      <div >
        <Navbar />
        <main>
        <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App;