import React from 'react'

const ManageHaircuts = ({ isLoggedIn, checkAuth, isBarber }) => {
  return (
    <>
    {isBarber? <div>ManageHaircuts</div> : <div>ManageAllHaircuts</div>}
    </>
    
  )
}

export default ManageHaircuts