import React, { useState } from 'react'
import OverViewView from './OverViewView'
import Loading from '../../components/Loading'

export const OverViewController = () => {
   const [loading,setLoading] = useState(false)
   return (
      <div>
         {loading && <Loading />}
         <OverViewView setLoading={setLoading}/></div>
   )
}

