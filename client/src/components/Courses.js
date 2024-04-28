import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { jwtDecode } from 'jwt-decode';
import {useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from './Loader';

const Courses = () => {
  const decode = jwtDecode(localStorage.getItem('token'));

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const decodedtoken = jwtDecode(token);
  const [loading, setloading] = useState(true)
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };


  const handleConfirmDelete = async () => {

    try {
      const response = await fetch(`http://localhost:5000/courses/${selectedCourse.course_id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      console.log('Course deleted successfully');

      setShowModal(false);

      setCourses(prevCourses => prevCourses.filter(course => course.course_id !== selectedCourse.course_id));
      
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error.message || 'Failed to delete course');
    }
  };


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


  const fetchData = async () => {
    try {
      const department = decodedtoken.department;
      const response = await fetch(`http://localhost:5000/courses/${department}`);
      const data = await response.json();
      setCourses(data);
      setloading(false);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };


  useEffect(() => {
    if (decodedtoken) {
      fetchData();
    }
  }, []);


  return (
    loading ? <Loader></Loader> :
      <div>
        <div className='flex'>
          <Sidebar decodedtoken={decodedtoken}></Sidebar>
          <div className="table-container">
            {
              courses && courses.length !== 0 && <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Course ID
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">

                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map(course => (
                    <tr key={course.course_id}>
                      <td className="px-6 py-4 whitespace-no-wrap">{course.course_id}</td>
                      <td className="px-6 py-4 whitespace-no-wrap">{course.title}</td>
                      <td className="px-6 py-4 whitespace-no-wrap">{course.dept_name}</td>
                      <td className="px-6 py-4 whitespace-no-wrap">{course.credits}</td>
                      <td>
                        {decodedtoken.role === 'admin' && <button className='bg-red-600 p-1 font-semibold rounded-sm text-white' onClick={() => handleDeleteClick(course)}>delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
            {
              courses.length === 0 && <div className='font-bold text-3xl flex justify-center items-center text-gray-800 h-screen w-[70vw]'>No courses added yet</div>
            }
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-8 flex flex-col items-center">
                  <p>Are you sure you want to delete the course?</p>
                  <div className='flex gap-3 mt-3'>
                    <button className='bg-indigo-500 font-bold text-white p-2 px-5' onClick={handleConfirmDelete}>Yes</button>
                    <button className='bg-gray-600 font-bold text-white p-2 px-5' onClick={() => setShowModal(false)}>No</button>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>

  )
}

export default Courses;

