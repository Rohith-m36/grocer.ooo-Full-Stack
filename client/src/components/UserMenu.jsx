import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Divider from './Divider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { HiOutlineExternalLink } from 'react-icons/hi';
import isAdmin from '../utils/isAdmin';

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios(SummaryApi.logout);
      if (response.data.success) {
        close?.();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    close?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-80">
      <div className="font-semibold text-xl text-gray-800">My Account</div>
      <div className="text-sm flex items-center gap-2 text-gray-600 mt-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}{' '}
          {user.role === 'ADMIN' && <span className="text-red-600">(Admin)</span>}
        </span>
        <Link onClick={handleClose} to="/dashboard/profile" className="text-primary-600 hover:text-primary-200">
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider className="my-2" />

      <div className="text-sm grid gap-2">
        {isAdmin(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/dashboard/category"
              className="px-4 py-2 rounded-md hover:bg-orange-200 transition-colors duration-300"
            >
              Category
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/subcategory"
              className="px-4 py-2 rounded-md hover:bg-orange-200 transition-colors duration-300"
            >
              Sub Category
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/upload-product"
              className="px-4 py-2 rounded-md hover:bg-orange-200 transition-colors duration-300"
            >
              Upload Product
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/product"
              className="px-4 py-2 rounded-md hover:bg-orange-200 transition-colors duration-300"
            >
              Product
            </Link>
          </>
        )}
        <Link
          onClick={handleClose}
          to="/dashboard/myorders"
          className="px-4 py-2 rounded-md hover:bg-orange-200 transition-colors duration-300"
        >
          My Orders
        </Link>
        <Link
          onClick={handleClose}
          to="/dashboard/address"
          className="px-4 py-2 rounded-md hover:bg-orange-200 transition-colors duration-300"
        >
          Save Address
        </Link>
        <button
          onClick={handleLogout}
          className="text-left px-4 py-2 w-full rounded-md text-red-600 hover:bg-orange-200 transition-colors duration-300"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
