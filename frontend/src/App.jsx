import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layout Components
import UltimateHeader from './components/layout/UltimateHeader'
import UltimateFooter from './components/layout/UltimateFooter'
import AdminLayout from './components/admin/AdminLayout'

// Pages - Ultimate Design
import UltimatePetHome from './pages/UltimatePetHome'
import UltimateLogin from './pages/UltimateLogin'
import UltimateRegister from './pages/UltimateRegister'
import UltimateProducts from './pages/UltimateProducts'
import UltimateProductDetail from './pages/UltimateProductDetail'
import UltimateCart from './pages/UltimateCart'
import UltimateCheckout from './pages/UltimateCheckout'
import UltimateOrders from './pages/UltimateOrders'
import UltimateOrderSuccess from './pages/UltimateOrderSuccess'
import UltimateProfile from './pages/UltimateProfile'
import UltimateForgotPassword from './pages/UltimateForgotPassword'
import UltimateServices from './pages/UltimateServices'
import UltimateBookAppointment from './pages/UltimateBookAppointment'
import UltimateAppointments from './pages/UltimateAppointments'
import UltimateServiceDetail from './pages/UltimateServiceDetail'
import UltimateAppointmentDetail from './pages/UltimateAppointmentDetail'

// Admin Pages
import UltimateAdminDashboard from './pages/admin/UltimateAdminDashboard'
import UltimateAdminProducts from './pages/admin/UltimateAdminProducts'
import UltimateAdminOrders from './pages/admin/UltimateAdminOrders'
import UltimateAdminUsers from './pages/admin/UltimateAdminUsers'
import UltimateAdminServices from './pages/admin/UltimateAdminServices'
import UltimateAdminAppointments from './pages/admin/UltimateAdminAppointments'
import UltimateAdminStatistics from './pages/admin/UltimateAdminStatistics'

// Wishlist & Compare
import UltimateWishlist from './pages/UltimateWishlist'
import UltimateCompare from './pages/UltimateCompare'
import UltimateOrderDetail from './pages/UltimateOrderDetail'
import CustomerAppointmentEdit from './pages/customer/CustomerAppointmentEdit'

// Chat
import Chat from './pages/Chat'
import AdminChat from './pages/admin/AdminChat'

// Sales Pages
import SalesDashboard from './pages/sales/SalesDashboard'
import SalesCustomers from './pages/sales/SalesCustomers'
import SalesCustomerDetail from './pages/sales/SalesCustomerDetail'
import SalesOrders from './pages/sales/SalesOrders'
import SalesOrderDetail from './pages/sales/SalesOrderDetail'
import SalesAppointments from './pages/sales/SalesAppointments'
import SalesCreateOrder from './pages/sales/SalesCreateOrder'
import SalesReviews from './pages/sales/SalesReviews'
import SalesChat from './pages/sales/SalesChat'

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffAppointments from './pages/staff/StaffAppointments'
import StaffSchedule from './pages/staff/StaffSchedule'
import StaffChat from './pages/staff/StaffChat'

// Components
import ProtectedRoute from './components/common/ProtectedRoute'

// Context Providers
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { CompareProvider } from './contexts/CompareContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <BrowserRouter>
          <Routes>
            {/* Home */}
            <Route path="/" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimatePetHome />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Auth Routes - No Header/Footer for full screen experience */}
            <Route path="/login" element={<UltimateLogin />} />
            <Route path="/register" element={<UltimateRegister />} />
            <Route path="/forgot-password" element={<UltimateForgotPassword />} />

            {/* Products */}
            <Route path="/products" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateProducts />
                </main>
                <UltimateFooter />
              </div>
            } />

            <Route path="/products/:id" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateProductDetail />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Services */}
            <Route path="/services" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateServices />
                </main>
                <UltimateFooter />
              </div>
            } />

            <Route path="/appointments/book/:serviceId" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateBookAppointment />
                </main>
                <UltimateFooter />
              </div>
            } />

            <Route path="/services/:id" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateServiceDetail />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Appointments */}
            <Route path="/appointments" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateAppointments />
                </main>
                <UltimateFooter />
              </div>
            } />

            <Route path="/appointments/:id" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateAppointmentDetail />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Cart & Checkout */}
            <Route path="/cart" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateCart />
                </main>
                <UltimateFooter />
              </div>
            } />

            <Route path="/checkout" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateCheckout />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Orders */}
            <Route path="/orders" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateOrders />
                </main>
                <UltimateFooter />
              </div>
            } />

+            <Route path="/order-success/:orderId" element={<UltimateOrderSuccess />} />
            {/* Profile */}
            <Route path="/profile" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateProfile />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Wishlist */}
            <Route path="/wishlist" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateWishlist />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Compare */}
            <Route path="/compare" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateCompare />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Order Detail */}
            <Route path="/orders/:id" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <UltimateOrderDetail />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Appointment Edit */}
            <Route path="/appointments/:id/edit" element={
              <div className="flex flex-col min-h-screen">
                <UltimateHeader />
                <main className="flex-1">
                  <CustomerAppointmentEdit />
                </main>
                <UltimateFooter />
              </div>
            } />

            {/* Chat - Customer */}
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<UltimateAdminDashboard />} />
              <Route path="products" element={<UltimateAdminProducts />} />
              <Route path="orders" element={<UltimateAdminOrders />} />
              <Route path="users" element={<UltimateAdminUsers />} />
              <Route path="services" element={<UltimateAdminServices />} />
              <Route path="appointments" element={<UltimateAdminAppointments />} />
              <Route path="statistics" element={<UltimateAdminStatistics />} />
              <Route path="chat" element={<AdminChat />} />
            </Route>

            {/* Sales Routes */}
            <Route path="/sales" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesDashboard />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/sales/customers" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesCustomers />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/sales/customers/:id" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesCustomerDetail />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/sales/orders" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesOrders />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/sales/orders/:id" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesOrderDetail />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/sales/appointments" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesAppointments />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/sales/create-order" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesCreateOrder />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/sales/reviews" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesReviews />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/sales/chat" element={
              <ProtectedRoute salesOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <SalesChat />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            {/* Staff Routes */}
            <Route path="/staff" element={
              <ProtectedRoute staffOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <StaffDashboard />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/staff/appointments" element={
              <ProtectedRoute staffOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <StaffAppointments />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/staff/schedule" element={
              <ProtectedRoute staffOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <StaffSchedule />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/staff/chat" element={
              <ProtectedRoute staffOnly={true}>
                <div className="flex flex-col min-h-screen">
                  <UltimateHeader />
                  <main className="flex-1">
                    <StaffChat />
                  </main>
                  <UltimateFooter />
                </div>
              </ProtectedRoute>
            } />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
