import { ShoppingBag, Search, Menu, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const Navbar = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(status)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">

      <div className="w-full px-4 md:px-10 py-4 flex items-center justify-between">

        <Link to="/" className="text-2xl md:text-3xl font-bold text-gray-900">
          TechNova<span className="text-pink-500">.</span>
        </Link>

        <div className="hidden md:flex flex-1 mx-8 max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-full py-2 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">

          <div className="hidden md:flex items-center space-x-4 text-sm">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-500 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black transition"
              >
                Logout
              </button>
            )}
          </div>

          <div
            onClick={() => navigate("/cart")}
            className="flex items-center cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag size={22} className="text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                1
              </span>
            </div>
            <div className="hidden md:block ml-2 text-sm">
              <p className="uppercase text-xs text-gray-500">Your Cart</p>
              <p className="font-semibold text-pink-500">
                ₹10,149
              </p>
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>
      </div>

      <div className="hidden md:flex justify-center border-t py-4 space-x-10 font-medium text-gray-700">
        <Link to="/" className="hover:text-pink-500">HOME</Link>
        <Link to="/" className="hover:text-pink-500">CATEGORIES</Link>
        <Link to="/about" className="hover:text-pink-500">ABOUT</Link>
        <Link to="/contact" className="hover:text-pink-500">CONTACT</Link>
      </div>

      {isOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-4 bg-white shadow-md">

          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <Link to="/" onClick={() => setIsOpen(false)} className="block">HOME</Link>
          <Link to="/" onClick={() => setIsOpen(false)} className="block">CATEGORIES</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block">ABOUT</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block">CONTACT</Link>

          {!isLoggedIn ? (
            <>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="block text-pink-500">Signup</Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block">Login</Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout()
                setIsOpen(false)
              }}
              className="block text-red-500"
            >
              Logout
            </button>
          )}

        </div>
      )}

    </header>
  )
}

export default Navbar