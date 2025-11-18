import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from './components/Content/Main';
import LoginView from './pages/Login&SignUp/LoginView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify styles

const App = () => {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/bizcore" element={<Main />}></Route>
          <Route path="/login" element={<LoginView />}></Route>
        </Routes>
        {/* ToastContainer to handle toast notifications */}
        <ToastContainer
          position="top-center" // Set default position
          autoClose={5000} // Auto close after 5 seconds
          hideProgressBar={false} // Show progress bar (optional)
          newestOnTop={true} // Make the most recent toast appear at the top
          closeOnClick={true} // Close on click
          rtl={false} // Left-to-right toast display
          pauseOnFocusLoss={false} // Don't pause when focus is lost
          draggable={true} // Allow dragging
          pauseOnHover={true} // Pause on hover
        />
      </Router>

    </div>
  )
}

export default App
