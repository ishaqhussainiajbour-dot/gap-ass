import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FarmersPage from './pages/farmers/FarmersPage'
import CustomersPage from './pages/customers/CustomersPage'
import WarehousesPage from './pages/inventory/WarehousesPage'
import InventoryPage from './pages/inventory/InventoryPage'
import OrdersPage from './pages/orders/OrdersPage'
import DeliveriesPage from './pages/deliveries/DeliveriesPage'
import QualityPage from './pages/quality/QualityPage'
import BillingPage from './pages/billing/BillingPage'
import CropsPage from './pages/crops/CropsPage'
import HarvestsPage from './pages/crops/HarvestsPage'
import StaffPage from './pages/staff/StaffPage'

const App = () => {
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="farmers" element={<FarmersPage />} />
          <Route path="crops" element={<CropsPage />} />
          <Route path="harvests" element={<HarvestsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="quality" element={<QualityPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="staff" element={<StaffPage />} />
        </Route>
        <Route path="/unauthorized" element={
          <div className="flex items-center justify-center h-screen text-red-500 text-xl">
            Unauthorized Access
          </div>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App