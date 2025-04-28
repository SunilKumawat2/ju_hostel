import React from 'react'
import OtpInput from 'react-otp-input';
const OtpExample = (props) => {
const{otp,handleChange}=props
 

  const renderInput = (props) => (
    <input {...props} style={{
      width: '25%',
      height: '45px',
      margin: '0 10px',
      fontSize: '20px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    }} />
  );
  return (
    
      <OtpInput
        value={otp}
        name="otp"
        onChange={handleChange} 
        numInputs={4} // Number of OTP digits
        separator={<span>-</span>} // Separator between inputs
        renderInput={renderInput}
        // isInputNum={true} // If the input should only accept numbers
      />
    
  )
}

export default OtpExample