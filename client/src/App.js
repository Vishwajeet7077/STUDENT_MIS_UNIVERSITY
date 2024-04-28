import './App.css';
import { Route, Router, Routes } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Faculty from './components/Faculty';
import Students from './components/Students';
import Courses from './components/Courses';
import Register from './components/Register';
import Studentcoursepage from './components/Studentcoursepage';

import Logout from './components/Logout';  


function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='/faculty' element={<Faculty></Faculty>}></Route>
        <Route path='/students' element={<Students></Students>}></Route>
        <Route path='/courses' element={<Courses></Courses>}></Route>
        <Route path='/register-course' element={<Register></Register>}></Route>
        <Route path='/my_courses' element={<Studentcoursepage></Studentcoursepage>}></Route>
        <Route path='/logout' element={<Logout />} />
      </Routes>
    </div>
  );
}


export default App;

