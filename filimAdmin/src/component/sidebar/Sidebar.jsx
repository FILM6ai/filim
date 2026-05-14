'use client';
import { useState } from 'react';
import {
  FaHome,
  FaShoppingCart,
  FaBars,
  FaAngleDown,
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdOutlineLogin } from 'react-icons/md';
import { motion } from 'framer-motion';
const menuItems = [
  {
    label: 'Pages',
    icon: <FaHome size={20} className='mr-3 text-white' />,
    link: '/',
    subMenu: [
      {
        label: 'Home',
        link: '/hero',
        icon: <FaHome size={16} className='mr-2' />,
      },
      {
        label: 'Studio',
        link: '/studio',
        icon: <FaHome size={16} className='mr-2' />,
      },
      {
        label: 'Services',
        link: '/services',
        icon: <FaHome size={16} className='mr-2' />,
      },
      {
        label: 'Festival',
        link: '/festival',
        icon: <FaHome size={16} className='mr-2' />,
      },
      {
        label: 'News',
        link: '/news',
        icon: <FaHome size={16} className='mr-2' />,
      },
      {
        label: 'Contact',
        link: '/contact',
        icon: <FaHome size={16} className='mr-2' />,
      },
      {
        label: 'Faq',
        link: '/faq',
        icon: <FaHome size={16} className='mr-2' />,
      },
      {
        label: 'Terms',
        link: '/terms',
        icon: <FaHome size={16} className='mr-2' />,
      },
    ],
  },
  {
    label: 'Menu',
    icon: <FaShoppingCart size={20} className='mr-3 text-white' />,
    link: '/menu',
    subMenu: [], // no sub-menu, so should route
  },
  {
    label: 'Blogs',
    icon: <FaShoppingCart size={20} className='mr-3 text-white' />,
    link: '/blog',
    subMenu: [], // no sub-menu, so should route
  },
  {
    label: 'Footer',
    icon: <FaShoppingCart size={20} className='mr-3 text-white' />,
    link: '/footer',
    subMenu: [], // no sub-menu, so should route
  },
  {
    label: 'Email',
    icon: <FaShoppingCart size={20} className='mr-3 text-white' />,
    link: '/email',
    subMenu: [], // no sub-menu, so should route
  },
  {
    label: 'Registrations',
    icon: <FaShoppingCart size={20} className='mr-3 text-white' />,
    link: '/registrations',
    subMenu: [],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
const [showPopup, setShowPopup] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/login');
  };
  const [openMenus, setOpenMenus] = useState({});

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div
      className={`${
        isOpen ? 'w-56' : 'w-20'
      } transition-width duration-300 border-r min-h-screen fixed flex flex-col bg-black`}
    >
      {/* Sidebar Header */}
      <div className='p-4 flex items-center justify-between'>
        <h1
          className={`text-xl text-white font-bold transition-all duration-300 ${
            !isOpen && 'hidden'
          }`}
        >
          Dashboard
        </h1>
        <button className='text-white cursor-pointer' onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className='mt-4 flex-1 overflow-y-auto'>
        {menuItems.map((menu) => (
          <div key={menu.label}>
            {menu.subMenu && menu.subMenu.length > 0 ? (
              // If submenu exists, clicking toggles the submenu
              <div
                className='flex items-center px-4 py-2 hover:bg-blue-500 group cursor-pointer'
                onClick={() => toggleSubMenu(menu.label)}
              >
                {menu.icon}
                <span
                  className={`text-white group-hover:text-white transition-all duration-300 ${
                    !isOpen && 'hidden'
                  }`}
                >
                  {menu.label}
                </span>
                {isOpen && (
                  <FaAngleDown
                    className={`ml-auto text-white transition-transform duration-300 ${
                      openMenus[menu.label] ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
            ) : (
              // If no submenu, wrap the item with Link for navigation
              <Link href={menu.link}>
                <div className='flex items-center px-4 py-2 hover:bg-blue-500 group cursor-pointer'>
                  {menu.icon}
                  <span
                    className={`text-white group-hover:text-white transition-all duration-300 ${
                      !isOpen && 'hidden'
                    }`}
                  >
                    {menu.label}
                  </span>
                </div>
              </Link>
            )}

            {/* Render submenu if it exists */}
            {menu.subMenu && menu.subMenu.length > 0 && (
              <div
                className={`ml-8 overflow-hidden transition-all duration-300 ${
                  openMenus[menu.label] ? 'max-h-96 text-white' : 'max-h-0'
                }`}
              >
                {menu.subMenu.map((sub) => (
                  <Link key={sub.label} href={sub.link}>
                    <div className='flex items-center px-4 py-2 hover:bg-blue-400 group'>
                      {sub.icon}
                      <span className='text-white group-hover:text-white transition-all duration-300'>
                        {sub.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {showPopup && (
          <motion.div className=' fixed top-0 bottom-0 right-0 left-0 inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex justify-center items-center p-2'>
            <motion.div
              initial={{ opacity: 0.2, z: 50 }}
              transition={{ duration: 0.3 }}
              whileInView={{ opacity: 1, z: 0 }}
              viewport={{ once: true }}
              className='flex  shadow-2xl flex-col w-[100%] sm:max-w-[40%] sm:w-full text-gray-800 justify-center bg-white p-5 rounded-md'
            >
              <p className='text-sm font-semibold'>
                Are you sure you want to logout?
              </p>
              <p className='text-sm text-gray-500'>
                You can login back at any time. All the changes you've been made
                will not be lost.
              </p>
              <div className='flex gap-2 justify-end mt-2'>
                <button
                  className='px-3 cursor-pointer py-1 text-black transition duration-300 border rounded hover:bg-gray-100'
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowPopup(false);
                  }}
                  className='px-3 py-1 cursor-pointer bg-red-600 text-white hover:bg-red-500 rounded transition-all'
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        <div
          onClick={() => setShowPopup(true)}
          className='flex items-center gap-2.5  cursor-pointer px-4 py-2 hover:bg-blue-600 text-white hover:text-white  transition-all duration-300 '
        >
          <MdOutlineLogin fontSize={22} />

          <button className=' cursor-pointer '>Logout</button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
