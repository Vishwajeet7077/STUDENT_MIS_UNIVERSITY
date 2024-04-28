



import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBook, FaGraduationCap, FaBookOpen, FaPlusSquare, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';

const SidebarContext = React.createContext();

export default function Sidebar({ decodedtoken }) {
  const [expanded, setExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  const navigate = useNavigate();

  const [sidebarItems, setSidebarItems] = useState([]);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const setSidebarItemsByRole = () => {
    switch (decodedtoken.role) {
      case 'admin':
        setSidebarItems([
          { icon: <FaUser />, text: 'Profile', active: true, to: '/dashboard' },
          { icon: <FaBook />, text: 'Faculties', active: false, to: '/faculty' },
          { icon: <FaGraduationCap />, text: 'Students', active: false, to: '/students' },
          { icon: <FaBookOpen />, text: 'Courses', active: false, to: '/courses' },
          { icon: <FaSignOutAlt />, text: 'Logout', active: false, to: '/logout' },
        ]);
        break;
      case 'student':
        setSidebarItems([
          { icon: <FaUser />, text: 'Profile', active: true, to: '/dashboard' },
          { icon: <FaBookOpen />, text: 'Courses', active: false, to: '/my_courses' },
          { icon: <FaPlusSquare />, text: 'Register for Course', active: false, to: '/register-course' },
          { icon: <FaSignOutAlt />, text: 'Logout', active: false, to: '/logout' },
        ]);
        break;
      case 'faculty':
        setSidebarItems([
          { icon: <FaUser />, text: 'Profile', active: true, to: '/dashboard' },
          { icon: <FaGraduationCap />, text: 'Student List', active: false, to: '/students' },
          // { icon: <FaBook />, text: 'My Courses', active: false, to: '/my-courses' },
          { icon: <FaSignOutAlt />, text: 'Logout', active: false, to: '/logout' },
        ]);
        break;
      default:
        setSidebarItems([]); // Default to empty array if role not recognized
    }
  };


  useEffect(() => {
    setSidebarItemsByRole();
  }, [decodedtoken.role]);


  return (
    <aside className="h-screen sticky top-0">
      <nav className="h-full flex flex-col bg-white border-r shadow-md">
        <div className="p-4 pb-2 flex justify-between items-center">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? '➔' : '➚'}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <div className="border-t flex p-3">
            {expanded && (
              <>
                <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-indigo-500">
                  <FaChevronRight size={16} className="mr-2" />
                  <img
                    src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(
                      decodedtoken.name
                    )}`}
                    alt=""
                    className="w-10 h-10 rounded-md"
                  />
                  <div className="leading-4 ml-3">
                    <h4 className="font-semibold">{decodedtoken.name}</h4>
                    <span className="text-xs text-gray-600">{decodedtoken.email}</span>
                  </div>
                </Link>
              </>
            )}
          </div>

          <ul className="flex-1 px-3 space-y-1 mt-2">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                <SidebarItem
                  icon={item.icon}
                  text={item.text}
                  active={index === activeIndex}
                  to={item.to}
                  onClick={() => {
                    handleItemClick(index);
                    navigate(item.to);
                  }}
                />
              </div>
            ))}
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}



const SidebarItem = ({ icon, text, active, to, onClick }) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-50 text-gray-600'}
    `}
      onClick={onClick}
    >
      {expanded && (
        <>
          <span className="mr-3">{icon}</span>
          <span>{text}</span>
        </>
      )}
    </li>
  );
};



