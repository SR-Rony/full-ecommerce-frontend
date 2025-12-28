
import { useFullStage } from '@/hooks/useFullStage';
import { isValidArray } from '@/util/func';
import { useState } from 'react';
import Select from 'react-select';
import CountryFlag from './CountryFlag';



function CountrySelector({onChangeSelectShippingOption}) {

  const customOption = ({ innerProps, label, value }) => (
    <div
      {...innerProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px', // Adjust the padding as needed
      }}
    >
      <div  style={{ marginLeft: '10px' }}>
      <CountryFlag country={{value,label: "Country"}} />
      </div>
      <span style={{ marginLeft: '8px' }}>{label}</span>
    </div>
  );

  const customCountryOption = ({ innerProps, label, countryShortCode,value }) => {
    // console.log("Props",innerProps,label,countryShortCode,value)
    return (
      <div
        {...innerProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px', // Adjust the padding as needed
        }}
      >
        <div  style={{ marginLeft: '10px' }}>
        <CountryFlag country={value} />
        </div>
        <span style={{ marginLeft: '8px' }}>{label}</span>
      </div>
    );
  }

  const { Auth, Settings }=useFullStage();
  const [setting, setSetting] = Settings?.Setting;
  const { appInfo, selectedShippingOption, shippingOptions } = setting || {};
  const [selectedCountry,setSelectedCountry] = useState(null);
  const countryIds = Array.from(new Set(isValidArray(shippingOptions)?shippingOptions.map((e)=>e.shippingCountry):[]))
  const countryOptions= isValidArray(countryIds)?countryIds.map((e)=>{
    const country = isValidArray(shippingOptions)?shippingOptions.filter((e1)=>e1.shippingCountry==e)[0]:{}
    return {
      label: country.country,
      countryShortCode: country.countryShortCode,
      value: {
        value: country.countryShortCode,
        label: country.country,
      },
      id: e,
    }
  }):[]


  if(!selectedCountry &&  countryIds.length===1 ) {
   if(isValidArray(shippingOptions)){
    setSelectedCountry(countryOptions[0])
   }
    const options = isValidArray(shippingOptions)?shippingOptions.filter((e1)=>e1?.shippingCountry==countryOptions[0]?.id):[];
 
    if(options.length===1 ) {
      onChangeSelectShippingOption(options[0])
    } else {
      onChangeSelectShippingOption(null)
    }
  }

  const hasOnlyOneOption =isValidArray(shippingOptions)?shippingOptions.filter((e1)=>e1?.shippingCountry==selectedCountry?.id).length === 1 :false
  console.log("hasOnlyOneOption",hasOnlyOneOption);
  console.log("ContryOpotions",countryOptions)
  console.log("shippingOptions",shippingOptions)

  if(selectedShippingOption && !selectedCountry) {
    setSelectedCountry(countryOptions.filter((e)=>e.id == selectedShippingOption.shippingCountry)[0])
  }

  return (
    <>
      <Select
        options={countryOptions}
        value={selectedCountry}
        onChange={(e)=>{
          setSelectedCountry(e)
          const options = shippingOptions.filter((e1)=>e1.shippingCountry==e.id);
          if(options.length===1 ) {
            onChangeSelectShippingOption(options[0])
          } else {
            onChangeSelectShippingOption(null)
          }
        }}
        
        placeholder="Search to select shipping country"
        components={{ Option: customCountryOption }}
      />
      { !hasOnlyOneOption && <Select
        options={isValidArray(shippingOptions)?shippingOptions.filter((e)=>e.shippingCountry==selectedCountry?.id):[]}
        value={selectedShippingOption}
        onChange={onChangeSelectShippingOption}
        placeholder="Search to select shipping options"
        components={{ Option: customOption }}
      /> }
    </>
  );
}

export default CountrySelector;
