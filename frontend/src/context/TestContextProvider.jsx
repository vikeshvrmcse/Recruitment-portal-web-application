import React, { useState } from 'react'
import { TestContext } from './TestContext'

function TestContextProvider({ children }) {
  const [requisitionData, setRequisitionData] = useState([]);

  return (
    <TestContext.Provider 
      value={{ requisitionData, setRequisitionData }}
    >
      {children}
    </TestContext.Provider>
  );
}

export  {TestContextProvider};