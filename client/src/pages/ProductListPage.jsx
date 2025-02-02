import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Link, useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const allSubCategory = useSelector(state => state.product.allSubCategory);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);

  const categoryId = params.category.split('-').slice(-1)[0];
  const subCategoryId = params.subCategory.split('-').slice(-1)[0];
  const subCategoryName = params?.subCategory?.split('-').slice(0, -1).join(' ');

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: { categoryId, subCategoryId, page: 1, limit: 8 },
      });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params]);

  useEffect(() => {
    setDisplaySubCategory(
      allSubCategory.filter(s => s.category.some(el => el._id === categoryId))
    );
  }, [params, allSubCategory]);

  return (
    <section className='sticky top-24 lg:top-20 bg-gray-50 py-6'>
      <div className='container mx-auto flex flex-col md:flex-row gap-6 p-4'>
        {/* Sub Categories */}
        <div className='w-full md:w-1/4 bg-white shadow-md p-4 rounded-lg overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-gray-300'>
          {displaySubCategory.map((s, index) => {
            const link = `/${valideURLConvert(s.category[0].name)}-${s.category[0]._id}/${valideURLConvert(s.name)}-${s._id}`;
            return (
              <Link
                key={s._id}
                to={link}
                className={`flex items-center gap-4 p-3 border-b transition-all rounded-lg hover:bg-green-100 ${subCategoryId === s._id ? 'bg-green-200' : ''}`}
              >
                <img src={s.image} alt='subCategory' className='w-14 h-14 object-cover rounded-lg' />
                <p className='text-sm font-semibold text-gray-700'>{s.name}</p>
              </Link>
            );
          })}
        </div>

        {/* Product List */}
        <div className='w-full md:w-3/4'>
          <div className='bg-white shadow-md p-4 rounded-lg mb-4'>
            <h3 className='text-xl font-bold text-gray-800'>{subCategoryName}</h3>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 bg-white shadow-md rounded-lg'>
            {data.length > 0 ? (
              data.map((p, index) => (
                <CardProduct data={p} key={p._id + "productSubCategory" + index} />
              ))
            ) : (
              <p className='text-center text-gray-500 w-full'>No products available</p>
            )}
          </div>
          {loading && <Loading />}
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
