import React, { useState } from 'react';
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isFormValid = Object.values(data).every((el) => el);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data,
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/verification-otp", {
                    state: data,
                });
                setData({
                    email: "",
                });
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 px-4'>
            <div className='bg-white shadow-lg rounded-xl p-8 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Forgot Password</h2>
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

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                            isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Send OTP
                    </button>
                </form>

                <p className='mt-4 text-center text-gray-600'>
                    Already have an account?{" "}
                    <Link to="/login" className='text-green-600 font-semibold hover:text-green-800'>
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default ForgotPassword;
