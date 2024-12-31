import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className='flex justify-between py-4 px-8 items-center'>
      <Link to="/" className="[&.active]:font-bold">
        <h1 className='font-bold text-2xl'>Stoxs</h1>
      </Link>
      <div className='flex gap-8'>
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
        <Link to="/addstocks" className="[&.active]:font-bold">
          Add Stock
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
    </div>
  )
}

export default Navbar