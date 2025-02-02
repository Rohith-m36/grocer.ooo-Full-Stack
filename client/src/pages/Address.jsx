import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddAddress from '../components/AddAddress';
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      });
      if (response.data.success) {
        toast.success("Address Removed");
        if (fetchAddress) {
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='bg-white shadow-md px-4 py-3 flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>Addresses</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className='bg-primary-200 text-white px-4 py-2 rounded-full hover:bg-primary-300 transition-all'
        >
          Add Address
        </button>
      </div>

      <div className='px-4 py-6 grid gap-6'>
        {
          addressList.map((address, index) => {
            return (
              <div className={`border rounded-lg p-4 bg-white shadow-sm transition-all ${!address.status && 'hidden'}`}>
                <div className='flex justify-between items-start'>
                  <div className='space-y-2'>
                    <p className='text-lg font-medium text-gray-800'>{address.address_line}</p>
                    <p className='text-gray-600'>{address.city}, {address.state}</p>
                    <p className='text-gray-600'>{address.country} - {address.pincode}</p>
                    <p className='text-gray-600'>{address.mobile}</p>
                  </div>
                  <div className='flex flex-col justify-between items-center space-y-2'>
                    <button
                      onClick={() => {
                        setOpenEdit(true);
                        setEditData(address);
                      }}
                      className='bg-green-200 p-2 rounded-full hover:bg-green-500 text-white transition-all'
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDisableAddress(address._id)}
                      className='bg-red-200 p-2 rounded-full hover:bg-red-500 text-white transition-all'
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        }

        <div
          onClick={() => setOpenAddress(true)}
          className='h-20 bg-blue-100 border-2 border-dashed flex justify-center items-center cursor-pointer rounded-lg hover:bg-blue-200 transition-all'
        >
          <span className='text-blue-500 text-xl font-semibold'>Add New Address</span>
        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }

      {
        OpenEdit && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
        )
      }
    </div>
  );
}

export default Address;
