import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Post from './pages/Post';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/post' element={<Post />} />
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
