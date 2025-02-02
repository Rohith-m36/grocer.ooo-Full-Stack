import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef();
    const subCategoryData = useSelector(state => state.product.allSubCategory);
    const loadingCardNumber = new Array(6).fill(null);

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: { id }
            });

            const { data: responseData } = response;
            if (responseData.success) {
                setData(responseData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryWiseProduct();
    }, []);

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 250;
    };

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 250;
    };

    const handleRedirectProductListPage = () => {
        const subcategory = subCategoryData.find(sub => sub.category.some(c => c._id === id));
        return `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`;
    };

    const redirectURL = handleRedirectProductListPage();

    return (
        <div className="bg-white shadow-md rounded-xl p-5 mx-auto max-w-7xl">
            {/* Title & See All */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-2xl font-bold text-gray-800">{name}</h3>
                <Link to={redirectURL} className="text-green-600 hover:text-green-500 transition duration-300 font-semibold">
                    See All →
                </Link>
            </div>

            {/* Product Scroll Section */}
            <div className="relative">
                <div
                    className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-2 py-2"
                    ref={containerRef}
                >
                    {loading
                        ? loadingCardNumber.map((_, index) => <CardLoading key={`loading-${index}`} />)
                        : data.map((p, index) => (
                            <CardProduct key={p._id + "-product"} data={p} />
                        ))}
                </div>

                {/* Scroll Buttons */}
                <div className="hidden lg:flex justify-between absolute inset-y-1/2 transform -translate-y-1/2 w-full px-4">
                    <button 
                        onClick={handleScrollLeft} 
                        className="p-3 bg-white bg-opacity-70 backdrop-blur-md shadow-md text-xl rounded-full hover:bg-gray-200 transition"
                    >
                        <FaAngleLeft />
                    </button>
                    <button 
                        onClick={handleScrollRight} 
                        className="p-3 bg-white bg-opacity-70 backdrop-blur-md shadow-md text-xl rounded-full hover:bg-gray-200 transition"
                    >
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryWiseProductDisplay;
