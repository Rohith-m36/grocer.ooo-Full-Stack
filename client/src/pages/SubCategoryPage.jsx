import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { LuPencil } from "react-icons/lu"
import { MdDelete } from "react-icons/md"
import { HiPencil } from "react-icons/hi"
import EditSubCategory from '../components/EditSubCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({ _id: "" })
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: "Name",
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className='flex justify-center items-center'>
            <img
              src={row.original.image}
              alt={row.original.name}
              className='w-12 h-12 cursor-pointer rounded-full border-2 border-gray-200 shadow-md transition-transform hover:scale-110'
              onClick={() => {
                setImageURL(row.original.image)
              }}
            />
          </div>
        )
      }
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((c, index) => {
              return (
                <span key={c._id + "table"} className='bg-gray-200 text-xs rounded-full px-2 py-1 mr-2'>
                  {c.name}
                </span>
              )
            })}
          </>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-center gap-3'>
            <button onClick={() => {
              setOpenEdit(true)
              setEditData(row.original)
            }} className='p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors'>
              <HiPencil size={20} className="text-green-600" />
            </button>
            <button onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} className='p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors'>
              <MdDelete size={20} className="text-red-500" />
            </button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='p-6'>
      {/* Header */}
      <div className='bg-white shadow-lg p-4 rounded-lg flex justify-between items-center'>
        <h2 className='font-semibold text-xl text-gray-800'>Sub Categories</h2>
        <button onClick={() => setOpenAddSubCategory(true)} className='text-sm border border-primary-200 bg-primary-100 text-primary-700 hover:bg-primary-200 px-4 py-2 rounded-md transition-all'>
          Add Sub Category
        </button>
      </div>

      {/* Table Section */}
      <div className='mt-6 bg-white p-4 rounded-lg shadow-md'>
        <DisplayTable
          data={data}
          column={column}
        />
      </div>

      {/* Add Sub Category Modal */}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {/* View Image Modal */}
      {ImageURL &&
        <ViewImage url={ImageURL} close={() => setImageURL("")} />
      }

      {/* Edit Sub Category Modal */}
      {openEdit &&
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      }

      {/* Delete Confirmation Box */}
      {openDeleteConfirmBox && (
        <CofirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  )
}

export default SubCategoryPage
