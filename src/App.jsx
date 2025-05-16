import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/DashBoard';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import MainLayout from './Layout/MainLayout';
import ErrorBoundary from './Components/ErrorBoundary';
import AddCourse from './Pages/AddCourse';
import EnrolledStudents from './Components/EnrolledStudents';  // Import EnrolledStudents

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
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
        <Route
          path="/addcourse"
          element={
            <MainLayout>
              <ErrorBoundary>
                <AddCourse />
              </ErrorBoundary>
            </MainLayout>
          }
        />
        {/* New route for enrolled students */}
        <Route
          path="/enrolled-students/:courseId"
          element={
            <MainLayout>
              <ErrorBoundary>
                <EnrolledStudents />
              </ErrorBoundary>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
