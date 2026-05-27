import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import {
  LayoutDashboard, Users, Wheat, Warehouse, ShoppingCart,
  Truck, BadgeCheck, CreditCard, LogOut, Menu, X, ChevronDown
} from 'lucide-react'

const navItems = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Farmers', path: '/dashboard/farmers', icon: Users },
    { label: 'Crops', path: '/dashboard/crops', icon: Wheat },
    { label: 'Harvests', path: '/dashboard/harvests', icon: Wheat },
    { label: 'Warehouses', path: '/dashboard/warehouses', icon: Warehouse },
    { label: 'Inventory', path: '/dashboard/inventory', icon: Warehouse },
    { label: 'Customers', path: '/dashboard/customers', icon: Users },
    { label: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
    { label: 'Deliveries', path: '/dashboard/deliveries', icon: Truck },
    { label: 'Quality Control', path: '/dashboard/quality', icon: BadgeCheck },
    { label: 'Billing', path: '/dashboard/billing', icon: CreditCard },
    { label: 'Staff', path: '/dashboard/staff', icon: Users },
  ],
  farmer: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Crops', path: '/dashboard/crops', icon: Wheat },
    { label: 'My Payments', path: '/dashboard/billing', icon: CreditCard },
  ],
  warehouse_staff: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/dashboard/inventory', icon: Warehouse },
    { label: 'Quality Control', path: '/dashboard/quality', icon: BadgeCheck },
  ],
  driver: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Deliveries', path: '/dashboard/deliveries', icon: Truck },
  ],
  customer: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Place Order', path: '/dashboard/orders', icon: ShoppingCart },
    { label: 'My Invoices', path: '/dashboard/billing', icon: CreditCard },
  ],
}

const DashboardLayout = () => {
  const { profile, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const items = navItems[profile?.role] || []

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-green-800 text-white flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-green-700">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold">GAP</h1>
              <p className="text-green-300 text-xs">Supply System</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-green-300 hover:text-white">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150
                ${isActive ? 'bg-green-600 text-white' : 'text-green-200 hover:bg-green-700 hover:text-white'}`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-green-700 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-green-200 hover:text-white text-sm w-full"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-700 font-semibold text-lg">
            Welcome back, {profile?.full_name} 👋
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium capitalize">
              {profile?.role?.replace('_', ' ')}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout