import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';

import Loader from './Loader';
import Sidebar from './Sidebar';


const Studentcoursepage = () => {
  const token = localStorage.getItem('token');

  const decode = jwtDecode(localStorage.getItem('token'));

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = decode.id;


  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/courses/student/${userId}`);
      const data = await response.json();
      console.log(data);
      setCourses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  if (loading) {
    return <Loader></Loader>;
  }


  return (
    <div className='flex '>
      <Sidebar decodedtoken={decode}></Sidebar>
      <div>
        <h2 className='font-bold text-2xl'>My Registered Courses</h2>

        {courses.length !== 0 && <table className="w-full border-collapse border border-gray-200 mt-6 ml-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Credits</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(item => (
              <tr key={item.course_id} className="bg-white">
                <td className="p-2 border border-gray-200">{item.course_id}</td>
                <td className="p-2 border border-gray-200">{item.title}</td>
                <td className="p-2 border border-gray-200">{item.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  );
};


export default Studentcoursepage;

