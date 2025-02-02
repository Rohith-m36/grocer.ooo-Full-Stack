import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
        if (fetchOrder) {
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order"
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Loading...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      stripePromise.redirectToCheckout({ sessionId: responseData.id })

      if (fetchCartItem) {
        fetchCartItem()
      }
      if (fetchOrder) {
        fetchOrder()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300'>
      <div className='container mx-auto p-6 flex flex-col lg:flex-row gap-6 justify-between bg-white rounded-xl shadow-lg'>
        {/* Address Section */}
        <div className='w-full'>
          <h3 className='text-xl font-semibold mb-4 text-gray-800'>Choose your address</h3>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            {addressList.map((address, index) => (
              <label htmlFor={"address" + index} key={index} className={!address.status && "hidden"}>
                <div className='border rounded-lg p-4 flex gap-3 hover:bg-blue-50 cursor-pointer transition-all'>
                  <input
                    id={"address" + index}
                    type='radio'
                    value={index}
                    onChange={(e) => setSelectAddress(e.target.value)}
                    name='address'
                    className='w-5 h-5 accent-green-500'
                  />
                  <div>
                    <p className='font-medium text-gray-800'>{address.address_line}</p>
                    <p className='text-gray-600'>{address.city}, {address.state}, {address.country} - {address.pincode}</p>
                    <p className='text-gray-600'>{address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}
            <div onClick={() => setOpenAddress(true)} className='mt-4 h-16 bg-blue-100 hover:bg-blue-200 border-2 border-dashed flex justify-center items-center cursor-pointer rounded-lg text-gray-700 font-medium'>
              Add Address
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className='w-full max-w-md bg-white py-6 px-4 rounded-lg shadow-xl'>
          <h3 className='text-xl font-semibold mb-4 text-gray-800'>Summary</h3>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800'>Bill Details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p className='text-gray-600'>Items Total</p>
              <p className='flex items-center gap-2 text-gray-800'>
                <span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p className='text-gray-600'>Quantity Total</p>
              <p className='text-gray-800'>{totalQty} item(s)</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p className='text-gray-600'>Delivery Charge</p>
              <p className='text-gray-800'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p className='text-gray-800'>Grand Total</p>
              <p className='text-green-600'>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>

          <div className='w-full flex flex-col gap-6 mt-4'>
            <button
              className='py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all'
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>
            <button
              className='py-3 px-6 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg font-semibold transition-all'
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}
    </section>
  )
}

export default CheckoutPage
