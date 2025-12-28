import React from 'react'
import Notifications from "../../../components/NotificationCard/Notifications";

const page = () => {
  return (
    <>
      <div className='text-white mb-2 text-lg'>Notifications</div>
      <Notifications isNotificationPage={true}/>
    </>
  )
}

export default page