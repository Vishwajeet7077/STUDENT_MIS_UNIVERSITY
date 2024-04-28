import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { jwtDecode } from 'jwt-decode';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from './Loader';


const Students = () => {
  const token = localStorage.getItem('token');

  const decode = jwtDecode(localStorage.getItem('token'));
  const decodedtoken = jwtDecode(token);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true)
  const [students, setstudents] = useState([])


  useEffect(() => {
    console.log('Inside useEffect');

    console.log('Token:', token);
    if (!token) {
      toast.error('Token missing / expired, Login again');
      navigate('/');
    } else {
      console.log('Decoded token:', decodedtoken);

      setTimeout(() => {
        setloading(false);
      }, 500);
    }
    console.log('Decoded token after setting state:', decodedtoken);
  }, []);


  const fetchData = async () => {
    try {
      if (!decodedtoken) {
        return;
      }
      const department = decodedtoken.department;
      console.log(department)
      const response = await fetch(`http://localhost:5000/students/${department}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("data " + data);
      setstudents(data);
      console.log(data);
      setstudents(prevData => [...prevData].sort((a, b) => a.ID.localeCompare(b.ID))); // Sort students after setting state
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  return (
    loading ? <Loader></Loader> :
      <div>
        {
          (decodedtoken.role !== "admin" && decodedtoken.role !== "faculty")
            ? <div className='flex flex-col justify-center items-center h-screen'>
              <div className='font-bold text-2xl'>Unauthorized</div>
              <NavLink to="/dashboard" className="bg-indigo-600 p-2 font-bold text-white rounded-md mt-5">return to dashboard</NavLink>
            </div>

            : <div className='flex'>
              <Sidebar decodedtoken={decodedtoken}></Sidebar>
              <div className="faculty-table-container">
                {students.length !== 0 && <table className="w-full border-collapse border border-gray-200 mt-6 ml-6">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(item => (
                      <tr key={item.ID} className="bg-white">
                        <td className="p-2 border border-gray-200">{item.ID}</td>
                        <td className="p-2 border border-gray-200">{item.name}</td>
                        <td className="p-2 border border-gray-200">{item.dept_name}</td>
                        <td className="p-2 border border-gray-200">{item.credits || 'Not specified'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
              </div>
              {
                students.length === 0 && <div className='font-bold text-3xl flex justify-center items-center text-gray-800 h-screen w-[70vw]'>No Students registered yet</div>
              }
            </div>
        }
      </div>

  )
}


export default Students;

