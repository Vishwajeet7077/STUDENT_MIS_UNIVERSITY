import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from './Loader';


const Dashboard = () => {
  const decode = jwtDecode(localStorage.getItem('token'));
  const [token, settoken] = useState(localStorage.getItem('token'))

  const navigate = useNavigate();

  const [decodedtoken, setdecodetoken] = useState(decode)

  const [loading, setloading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [deptName, setDeptName] = useState('');
  const [credits, setCredits] = useState('');
  const [profile, setProfile] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleCreateCourseClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const fetchUserProfile = async () => {
    try {
      console.log(decodedtoken)
      console.log(decodedtoken.id)
      const response = await fetch(`http://localhost:5000/profile/${decodedtoken.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();

      setProfile(data);
      setloading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error(error.message || 'Failed to fetch user profile');
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate form data
      if (!courseId || !title || !deptName || !credits) {
        throw new Error('All fields are required');
      }
      if (isNaN(parseInt(credits)) || parseInt(credits) <= 0) {
        throw new Error('Credits must be a positive number');
      }

      const courseData = {
        course_id: courseId,
        title: title,
        dept_name: deptName,
        credits: parseInt(credits)
      };

      const response = await fetch('http://localhost:5000/createcourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      toast.success('Course created successfully');

      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        console.log('Response data:', await response.text());
        responseData = null;
      }

      setCourseId('');
      setTitle('');
      setDeptName('');
      setCredits('');
    } catch (error) {
      // console.error('Error creating course:', error);
    }
  };


  const handleUpdatePassword = async () => {
    try {
      console.log(decodedtoken.id);

      const userId = decodedtoken.id;

      if (!oldPassword || !newPassword) {
        toast.error('provide required fields')
      }

      // Call the backend to update the password
      const response = await fetch('http://localhost:5000/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {

        toast.error(data.error);
        return;
      }

      // Reset form fields
      setOldPassword('');
      setNewPassword('');

      // Close the modal
      toast.success('Password updated successfully');
      setTimeout(() => { setIsModalOpen(false); }, 1000)
    } catch (error) {
      console.log(error);
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    }
  };



  useEffect(() => {
    console.log('Inside useEffect');

    console.log('Token:', token);
    if (!token) {
      toast.error('Token missing / expired, Login again');
      navigate('/');
    } else {
      // settoken(token);
      console.log('Decoded token:', jwtDecode(token));
      // setdecodetoken(jwtDecode(token));
    }
    fetchUserProfile();
    console.log('Decoded token after setting state:', decodedtoken);
    setTimeout(() => { setloading(false) }, 500)

  }, []);



  if (!decode) {
    navigate('/')
  }


  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className='flex flex-wrap'>
          <Sidebar decodedtoken={decodedtoken} />
          <div className='p-2'>
            {decodedtoken.role === 'admin' && (
              <div
                className='bg-indigo-500 p-6 rounded-md font-bold cursor-pointer text-white'
                onClick={handleCreateCourseClick}
              >
                Create a Course
              </div>
            )}
            <br/>
            <br/>
      

            <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
              {/* <h2 className="text-2xl font-semibold mb-4">User Profile</h2> */}
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">User Profile</h2>

              <div className="flex flex-wrap gap-4 justify-start">
                <div className="flex flex-col items-start">
                  <p className="text-gray-600"><strong>ID:</strong> {profile.id}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {profile.email}</p>
                  <p className="text-gray-600"><strong>Name:</strong> {profile.name}</p>
                  <p className="text-gray-600"><strong>Role:</strong> {profile.role}</p>
                  <p className="text-gray-600"><strong>Department:</strong> {profile.dept_name}</p>
                </div>
                <div className="flex items-end justify-end">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Password Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-4">
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password:</label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">Update Password</button>
              <button type="button" className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="modal-container">
            <div className="bg-white rounded-lg shadow-lg">
              <button
                className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="p-4">
                <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
                  <div className="mb-4">
                    <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course ID:</label>
                    <input
                      type="text"
                      id="courseId"
                      value={courseId}
                      onChange={(event) => setCourseId(event.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="deptName" className="block text-sm font-medium text-gray-700">Department Name:</label>

                    <select
                      className="block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-indigo-500"
                      name="department"
                      id="deptName"
                      value={deptName}
                      onChange={(event) => setDeptName(event.target.value)}
                    >
                      <option value="">Select Department</option>
                      <option value={decodedtoken.department}>{decodedtoken.department}</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="credits" className="block text-sm font-medium text-gray-700">Credits:</label>
                    <input
                      type="number"
                      id="credits"
                      value={credits}
                      onChange={(event) => setCredits(event.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="backdrop bg-gray-500 bg-opacity-75" onClick={handleCloseModal}></div>
        </div>
      )}
    </div>
  );

}

export default Dashboard;



