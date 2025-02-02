import React from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import AddToCartButton from './AddToCartButton';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import imageEmpty from '../assets/empty_cart.webp';
import toast from 'react-hot-toast';

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector(state => state.cartItem.cart);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout");
      if (close) {
        close();
      }
      return;
    }
    toast("Please Login");
  };

  return (
    <section className="bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50">
      <div className="bg-white w-full max-w-md min-h-screen ml-auto rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center p-5 shadow-lg justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="font-semibold text-xl">Cart</h2>
          <button onClick={close} className="text-white">
            <IoClose size={25} />
          </button>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] bg-blue-50 p-4 flex flex-col gap-4">
          {cartItem[0] ? (
            <>
              <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                <p>Your total savings</p>
                <p className="font-semibold">{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg grid gap-5 overflow-auto">
                {cartItem.map((item) => (
                  <div key={item?._id} className="flex w-full gap-4 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
                    <div className="w-20 h-20 bg-gray-100 border rounded flex justify-center items-center">
                      <img src={item?.productId?.image[0]} className="object-contain w-full h-full" alt={item?.productId?.name} />
                    </div>
                    <div className="w-full max-w-sm text-xs">
                      <p className="text-sm font-semibold truncate">{item?.productId?.name}</p>
                      <p className="text-neutral-400">{item?.productId?.unit}</p>
                      <p className="font-semibold">{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                    </div>
                    <div>
                      <AddToCartButton data={item?.productId} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 mt-4 shadow-xl rounded-lg">
                <h3 className="font-semibold text-lg">Bill details</h3>
                <div className="flex gap-4 justify-between ml-1 py-2">
                  <p>Items total</p>
                  <p className="flex items-center gap-2">
                    <span className="line-through text-neutral-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                    <span>{DisplayPriceInRupees(totalPrice)}</span>
                  </p>
                </div>
                <div className="flex gap-4 justify-between ml-1 py-2">
                  <p>Quantity total</p>
                  <p className="flex items-center gap-2">{totalQty} item(s)</p>
                </div>
                <div className="flex gap-4 justify-between ml-1 py-2">
                  <p>Delivery Charge</p>
                  <p className="flex items-center gap-2">Free</p>
                </div>
                <div className="font-semibold flex items-center justify-between gap-4 py-2">
                  <p>Grand total</p>
                  <p>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white flex flex-col justify-center items-center p-10">
              <img src={imageEmpty} className="w-48 h-48 object-contain mb-4" alt="Empty Cart" />
              <Link onClick={close} to="/" className="block bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg">
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-neutral-100 font-bold text-lg flex items-center justify-between">
            <div>{DisplayPriceInRupees(totalPrice)}</div>
            <button onClick={redirectToCheckoutPage} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 rounded-lg px-4 py-2">
              Proceed <FaCaretRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
