import React, { useState } from 'react'
import { UpdateRequisitionContext } from './TestContext'

function UpdateRequisitionContextProvider({ children }) {
  const [updateRequisitionData, setUpdateRequisitionData] = useState(null);

  return (
    <UpdateRequisitionContext.Provider 
      value={{ updateRequisitionData, setUpdateRequisitionData }}
    >
      {children}
    </UpdateRequisitionContext.Provider>
  );
}

export  {UpdateRequisitionContextProvider};