import React, { useState } from 'react'
import { TestContext } from './TestContext'

function UpdateRequisitionContextProvider({ children }) {
  const [updateRequisitionData, setUpdateRequisitionData] = useState(null);

  return (
    <TestContext.Provider 
      value={{ updateRequisitionData, setUpdateRequisitionData }}
    >
      {children}
    </TestContext.Provider>
  );
}

export  {UpdateRequisitionContextProvider};