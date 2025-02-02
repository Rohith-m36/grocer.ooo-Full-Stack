import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useSelector } from 'react-redux';
import logo from '../assets/grocer-logo.png';
import Search from './Search';
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import useMobile from '../hooks/useMobile';

const Header = () => {
    const [isMobile] = useMobile();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";
    const navigate = useNavigate();
    const user = useSelector((state) => state?.user);
    const cartItem = useSelector((state) => state.cartItem.cart);
    const { totalPrice, totalQty } = useGlobalContext();
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [openCartSection, setOpenCartSection] = useState(false);

    const redirectToLoginPage = () => navigate("/login");
    const handleMobileUser = () => user?._id ? navigate("/user") : navigate("/login");
    const handleCloseUserMenu = () => setOpenUserMenu(false);

    return (
        <header className='h-24 lg:h-20 shadow-md sticky top-0 z-50 flex flex-col justify-center bg-gradient-to-r from-green-200 to-green-500 text-white'>
            {!isSearchPage && isMobile && (
                <div className='container mx-auto flex items-center px-4 justify-between py-2'>
                    <Link to='/' className='flex items-center gap-2'>
                        <img src={logo} width={150} height={50} alt='Grocer Logo' className='hidden lg:block' />
                        <img src={logo} width={100} height={50} alt='Grocer Logo' className='lg:hidden' />
                    </Link>
                    <button className='text-white text-xl' onClick={handleMobileUser}>
                        <FaRegCircleUser />
                    </button>
                </div>
            )}

            <div className='container mx-auto flex items-center px-4 justify-between'>
                <Link to='/' className='h-full flex items-center'>
                    <img src={logo} width={180} height={60} alt='Grocer Logo' className='hidden lg:block' />
                </Link>

                <div className='hidden lg:block w-2/5'>
                    <Search />
                </div>

                <div className='flex items-center gap-6'>
                    {user?._id ? (
                        <div className='relative cursor-pointer flex items-center gap-1' onClick={() => setOpenUserMenu(!openUserMenu)}>
                            <p className='text-lg font-semibold'>Account</p>
                            {openUserMenu ? <GoTriangleUp size={20} /> : <GoTriangleDown size={20} />}
                            {openUserMenu && (
                                <div className='absolute right-0 top-12 bg-white text-black rounded-lg p-4 shadow-lg min-w-52'>
                                    <UserMenu close={handleCloseUserMenu} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={redirectToLoginPage} className='text-lg font-medium px-4 py-2 rounded-md bg-white text-green-700 hover:bg-gray-100'>
                            Login
                        </button>
                    )}

                    <button onClick={() => setOpenCartSection(true)} className='flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-md'>
                        <BsCart4 size={26} className='animate-bounce' />
                        <div className='font-semibold text-sm'>
                            {cartItem[0] ? (
                                <>
                                    <p>{totalQty} Items</p>
                                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                                </>
                            ) : (
                                <p>My Cart</p>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            <div className='container mx-auto px-4 lg:hidden'>
                <Search />
            </div>

            {openCartSection && <DisplayCartItem close={() => setOpenCartSection(false)} />}
        </header>
    );
};

export default Header;
