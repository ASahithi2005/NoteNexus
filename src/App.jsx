import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/DashBoard';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import MainLayout from './Layout/MainLayout';
import ErrorBoundary from './Components/ErrorBoundary';
import AddCourse from './Pages/AddCourse';
import EnrolledStudents from './Components/EnrolledStudents';
import CourseDetail from './Pages/CourseDetail';

function App() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const storedToken = localStorage.getItem('token'); 
const token = storedToken || null;

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
            user?.role === 'mentor' ? (
              <MainLayout>
                <ErrorBoundary>
                  <AddCourse />
                </ErrorBoundary>
              </MainLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/enrolled-students/:courseId"
          element={
            user?.role === 'mentor' ? (
              <MainLayout>
                <ErrorBoundary>
                  <EnrolledStudents />
                </ErrorBoundary>
              </MainLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <MainLayout>
            <ErrorBoundary>
              <CourseDetail user={user} token={token}/>
            </ErrorBoundary>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
