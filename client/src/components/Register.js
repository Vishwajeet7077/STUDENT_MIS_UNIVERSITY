import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';


const Register = () => {
  const decode = jwtDecode(localStorage.getItem('token'));
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [ setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const department = decode.department;
      const response = await fetch(`http://localhost:5000/courses/${department}`);
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const handleCheckboxChange = (courseId) => {
    console.log("Checkbox clicked for course ID:", courseId);
    setSelectedCourses((prevSelectedCourses) => {
      console.log("Previous selectedCourses:", prevSelectedCourses);
      const isSelected = prevSelectedCourses.includes(courseId);
      if (isSelected) {
        // If already selected, remove it from the list
        return prevSelectedCourses.filter((id) => id !== courseId);
      } else {
        // If not selected, add it to the list
        return [...prevSelectedCourses, courseId];
      }
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedCourses.length === 0) {
      toast.error('Please select course to register');
      return;
    }
    if (!studentId) {
      toast.error('Please provide student id');
      return;
    }
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/course/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, selectedCourses }),
      });
      const data = await response.json();
      console.log(response)
      console.log(data);
      if (response.ok) {
        toast.success('Registration successful')
      }
    } catch (error) {
      toast.error('Registration failed')
      console.error('Error registering courses:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Course Registration</h2>
      <form onSubmit={handleSubmit}>
        <select
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="mb-4 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select ID</option>
          <option value={decode.id}>{decode.id}</option>
        </select>
        {courses.map((course) => (
          <div key={course.course_id} className="mb-2 flex flex-col items-start">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value={course.course_id} // Ensure unique value for each checkbox
                checked={selectedCourses.includes(course.course_id)}
                onChange={() => handleCheckboxChange(course.course_id)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">{course.title}</span>
            </label>
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 mb-5 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4"
        >
          Register
        </button>
      </form>
      <NavLink to="/dashboard" className=" bg-indigo-500 p-2 text-white font-semibold mt-10">Return Home</NavLink>
    </div>
  );
};

export default Register;
