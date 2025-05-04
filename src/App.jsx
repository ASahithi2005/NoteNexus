import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/DashBoard';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import MainLayout from './Layout/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
              <Dashboard />
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <MainLayout>
              <SignUp />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
