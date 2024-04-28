import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { jwtDecode } from 'jwt-decode';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from './Loader';


const Faculty = () => {

  const decode = jwtDecode(localStorage.getItem('token'));

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const decodedtoken = jwtDecode(token);
  const [loading, setloading] = useState(true)
  const [faculties, setfaculties] = useState([])

  
  useEffect(() => {
    console.log('Inside useEffect');

    console.log('Token:', token);
    if (!token) {
      toast.error('Token missing / expired, Login again');
      navigate('/');
    } else {
      console.log('Decoded token:', decodedtoken);
    }
  }, []);


  useEffect(() => {
    if (decodedtoken) {
      fetchData()
      fetchData(); // Fetch data only if decodedtoken is available
    }
  }, []);


  const fetchData = async () => {
    try {
      const department = decodedtoken.department;
      console.log(department)
      const response = await fetch(`http://localhost:5000/faculties/${department}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("data " + data);
      setfaculties(data);
      console.log(data);
      setfaculties(prevData => [...prevData].sort((a, b) => a.ID.localeCompare(b.ID))); // Sort faculties after setting state
      setloading(false);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };


  return (
    loading ? <Loader></Loader> :
      <div>
        {
          decodedtoken.role !== "admin"
            ? <div className='flex flex-col justify-center items-center h-screen'>
              <div className='font-bold text-2xl'>Unauthorized</div>
              <NavLink to="/dashboard" className="bg-indigo-600 p-2 font-bold text-white rounded-md mt-5">return to dashboard</NavLink>
            </div>

            : <div className='flex'>
              <Sidebar decodedtoken={decodedtoken}></Sidebar>
              {
                faculties.length !== 0 && <div className="faculty-table-container">
                  <table className="w-full border-collapse border border-gray-200 mt-6 ml-6">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculties.map(item => (
                        <tr key={item.ID} className="bg-white">
                          <td className="p-2 border border-gray-200">{item.ID}</td>
                          <td className="p-2 border border-gray-200">{item.name}</td>
                          <td className="p-2 border border-gray-200">{item.dept_name}</td>
                          <td className="p-2 border border-gray-200">{item.Salary || 'Not specified'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>}

              {
                faculties.length === 0 && <div className='font-bold text-3xl flex justify-center items-center text-gray-800 h-screen w-[70vw]'>No Faculties registered yet</div>
              }
            </div>
        }
      </div>
  )

}


export default Faculty;

