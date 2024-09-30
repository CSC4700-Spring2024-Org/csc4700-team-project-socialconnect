import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Post from './pages/Post';
import AnalyticsPage from './pages/AnalyticsPage'
import CalendarPage from './pages/CalendarPage'
import PrivacyPolicyPage from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import CreatedAccount from './pages/CreatedAccount';
import VerifySuccess from './pages/VerifySuccess';
import VerifyFailed from './pages/VerifyFailed';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/post' element={<Post />} />
            <Route path='/analytics' element={<AnalyticsPage />} />
            <Route path='/calendar' element={<CalendarPage />} />
            <Route path='/privacypolicy' element={<PrivacyPolicyPage />} />
            <Route path='/termsandconditions' element={<TermsAndConditions />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/verifyEmail' element={<CreatedAccount/>} />
          <Route path="/verifySuccess" element={<VerifySuccess />} />
          <Route path="/verifyFailed" element={<VerifyFailed />} />


        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
