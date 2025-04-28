// import React from 'react'
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'

// const PhoneSelector = (props) => {

  
//   const{phnumber,phoneInput}=props
//   const options = {
//     country: 'us',
//     preferredCountries: ['in', 'us', 'gb'],
//     enableSearch:true
//   }
//   return (
//     <div>
//       <PhoneInput
//         {...options}
//         placeholder="Phone Number"
//         className="custom-phone-input"
//         name='phnumber'
//         onChange={(value) => {
//           phoneInput(value); 
//         }}
//       />
      
//     </div>
//   )
// }

// export default PhoneSelector

import React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const PhoneSelector = (props) => {
  const { phnumber, phoneInput } = props

  return (
    <div>
      <PhoneInput
        country={'in'}               // Set default country to India
        onlyCountries={['in']}       // Restrict to India only
        disableDropdown={true}       // Hide dropdown to prevent switching
        placeholder="Phone Number"
        className="custom-phone-input"
        value={phnumber}             // Use passed phone number
        name="phnumber"
        onChange={(value) => {
          phoneInput(value)
        }}
      />
    </div>
  )
}

export default PhoneSelector
