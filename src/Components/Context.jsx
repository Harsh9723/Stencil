import React, { useState } from 'react'
import { createContext } from 'react'


export const datacontext = createContext(

)

function Context(children) {
const [mfr, setMfr] = useState('hello')

  return (
    <datacontext.Provider value={[mfr, setMfr]}>
        {children}
    </datacontext.Provider>
)
}

export default Context