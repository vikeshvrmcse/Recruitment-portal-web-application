import React, { useState } from 'react'
import { EmployeeLoginContext } from './TestContext'

function EmployeeLoginContextProvider({children}) {
    const [loginInformation, setLoginInformation]=useState([])
    const [tlLoginInformation, setTLLoginInformation]=useState([])

  return (
    <EmployeeLoginContext.Provider value={{loginInformation, setLoginInformation, tlLoginInformation, setTLLoginInformation}}>
        {children}
    </EmployeeLoginContext.Provider>
  )
}

export {EmployeeLoginContextProvider}