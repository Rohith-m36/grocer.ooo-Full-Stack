import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        return Object.values(data).every(el => el) && data.password === data.confirmPassword && validateEmail(data.email);
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must be the same");
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
                navigate("/login");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome to <span className="text-green-700">Grocer.ooo</span>
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="text-gray-600 font-medium">Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="text-gray-600 font-medium">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-gray-600 font-medium">Password:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-4 cursor-pointer text-gray-500 hover:text-gray-700">
                                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="text-gray-600 font-medium">Confirm Password:</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                            />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-3 right-4 cursor-pointer text-gray-500 hover:text-gray-700">
                                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!validateForm()}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${validateForm() ? "bg-green-700 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-green-700 hover:text-green-800">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;
