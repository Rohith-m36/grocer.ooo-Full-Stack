import React from 'react';
import UserMenu from '../components/UserMenu';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector(state => state.user);

  console.log('user dashboard', user);

  return (
    <section className="bg-gray-100 min-h-screen flex">
      <div className="container mx-auto flex w-full h-full p-4">
        {/* Left side for menu */}
        <div className="w-64 bg-white rounded-xl shadow-md p-4 sticky top-24 h-full overflow-y-auto transition-all hover:shadow-lg">
          <UserMenu />
        </div>

        {/* Right side for content */}
        <div className="flex-1 bg-white rounded-xl shadow-md ml-4 p-6 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
