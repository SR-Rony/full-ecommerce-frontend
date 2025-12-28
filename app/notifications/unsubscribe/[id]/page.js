"use client"
import Loader from "@/components/Loader/Loader"
import { unsubscribeMail } from "@/util/instance"
import { ToastEmitter } from "@/util/Toast"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, } from "react"

const Unsubscribe = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
const navigate =useRouter()
  const handleUnsubscribe = async () => {
    try {
      if (id) {
        const res = await unsubscribeMail(id)
        setIsLoading(false)
        if (res?.data?.success) {
          ToastEmitter('success', res?.data?.message)
          navigate.push('/')
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  useEffect(() => {
    handleUnsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return (
    <div className='text-white text-center'>

      <div className="py-8 px-4 text-white rounded">
        {isLoading && <>
          <Loader bg="rgba(0,0,0,0)" />
          <p className="text-[20px] font-[600] text-center mt-3 ">
            Loading...
          </p>
        </>}
      </div>
    </div>
  )
}

export default Unsubscribe