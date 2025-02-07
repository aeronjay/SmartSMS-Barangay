import { useState } from 'react'
import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom'
import HomePage from '../routes/HomePage'
import AdminDashboard from '../routes/AdminDashboard'
import LoginPage from '../routes/LoginPage'
import UserRegistration from '../routes/UserRegistration'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/admindashboard' element={<AdminDashboard />} />
          <Route path='/loginpage' element={<LoginPage />} />
          <Route path='/user' element={<UserRegistration />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
