import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/DashBoard';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import MainLayout from './Layout/MainLayout';
import ErrorBoundary from './Components/ErrorBoundary';
import AddCourse from './Pages/AddCourse';
import EnrolledStudents from './Components/EnrolledStudents';
import CourseDetail from './Pages/CourseDetail';
import AllAssignmentsPage from './Pages/AllAssignmentsPage';
import StudentsPage from './Pages/StudentPage';
import NotesPage from './Pages/NotesPage';
import SettingsPage from './Pages/SettingsPage';

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
        <Route path="/assignments" element={
          <MainLayout><AllAssignmentsPage token={token} /></MainLayout> }></Route>
          <Route path="/students" element={
          <MainLayout><StudentsPage token={token} /></MainLayout> }></Route>
          <Route path="/resources" element={
          <MainLayout><NotesPage token={token} /></MainLayout> }></Route>
          <Route path="/settings" element={
          <MainLayout><SettingsPage token={token} /></MainLayout> }></Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
