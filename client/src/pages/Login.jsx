import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isFormValid = Object.values(data).every((value) => value.trim() !== "");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data,
            });

            if (response.data.error) {
                toast.error(response.data.message);
                return;
            }

            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));
                setData({ email: "", password: "" });
                navigate("/");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 px-4'>
            <div className='bg-white shadow-lg rounded-xl p-8 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Welcome Back</h2>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                            Email:
                        </label>
                        <input
                            type='email'
                            id='email'
                            className='w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>

                    <div>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                            Password:
                        </label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <span
                                className='absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer'
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </span>
                        </div>
                        <Link to="/forgot-password" className='block text-right text-sm text-green-600 hover:text-green-800 mt-2'>
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                            isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Login
                    </button>
                </form>

                <p className='mt-4 text-center text-gray-600'>
                    Don't have an account?{" "}
                    <Link to="/register" className='text-green-600 font-semibold hover:text-green-800'>
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
