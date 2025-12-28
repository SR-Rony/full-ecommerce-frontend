import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneNumberInput = ({ onChanges, phoneNum, phoneRef=null, passwordRef }) => {
  return (
    <div className="relative">
      <PhoneInput
        className='w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300'
        placeholder="Enter phone number"
        value={phoneNum}
        ref={phoneRef}
        defaultCountry='US'
        countries={['US']}
        addInternationalOption={false}
        onChange={onChanges} 
        onKeyDown={(e) => {
          if (e.key === 'Enter' && passwordRef) {
            passwordRef.current.focus();
          }
        }} 
      />
      <style jsx global>{`
        .PhoneInputInput {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          color: white !important;
          font-size: 16px !important;
          padding: 0 !important;
          width: 100% !important;
        }
        .PhoneInputInput::placeholder {
          color: rgb(156 163 175) !important;
        }
        .PhoneInputInput:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        .PhoneInputCountrySelect {
          background: transparent !important;
          border: none !important;
          color: white !important;
          outline: none !important;
          margin-right: 8px !important;
        }
        .PhoneInputCountrySelect:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        .PhoneInputCountryIcon {
          border-radius: 4px !important;
        }
        .PhoneInputCountrySelectArrow {
          color: white !important;
          border-left-color: white !important;
        }
      `}</style>
    </div>
  )
}

export default PhoneNumberInput