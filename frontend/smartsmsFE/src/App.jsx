import { useState } from 'react'
import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom'
import HomePage from '../routes/HomePage'
import Admin from '../routes/Admin'
import LoginPage from '../routes/LoginPage'
import UserRegistration from '../routes/UserRegistration'
import PrivateRoute from '../routes/PrivateRoute'
import { AuthProvider } from "../context/AuthContext";

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route element={<PrivateRoute />}>
            <Route path='/admindashboard/*' element={<Admin />} />
          </Route>
          <Route path='/loginpage' element={<LoginPage />} />
          <Route path='/user' element={<UserRegistration />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
