import React, { useEffect, useState } from 'react';
import CardLoading from '../components/CardLoading';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import CardProduct from '../components/CardProduct';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import noDataImage from '../assets/nothing here yet.webp';

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const params = useLocation();
  const searchText = params?.search?.slice(3);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData((prev) => {
            return [
              ...prev,
              ...responseData.data,
            ];
          });
        }
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        <p className='font-semibold text-xl text-gray-700 mb-6'>
          Search Results for: <span className='text-green-600'>{searchText}</span>
        </p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
          loader={<div className="text-center py-4 text-gray-500">Loading...</div>}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {data.map((p, index) => {
              return <CardProduct data={p} key={p?._id + "searchProduct" + index} />;
            })}

            {loading &&
              loadingArrayCard.map((_, index) => {
                return <CardLoading key={"loadingsearchpage" + index} />;
              })
            }
          </div>
        </InfiniteScroll>

        {!data[0] && !loading && (
          <div className='flex flex-col justify-center items-center w-full mx-auto mt-12'>
            <img
              src={noDataImage}
              alt="No Data"
              className='w-48 h-48 object-cover mb-4'
            />
            <p className='font-semibold text-gray-700'>No Data Found</p>
            <p className='text-gray-500 mt-2'>Please try again with a different search term.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
