import toast, { Toaster } from 'react-hot-toast';

function capitalizeFirstLetter(inputString) {
    // Validation: Check if the input is a non-empty string
    if (typeof inputString !== 'string' || inputString.length === 0) {
      return ""
    }
  
    // Capitalize the first letter and convert the rest to lowercase
    const resultString = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  
    return resultString;
  }
export const ToastEmitter = (type,message) =>{
    if(type ==='success'){
        return toast.success(capitalizeFirstLetter(message))
    }else{
        return toast.error(capitalizeFirstLetter(message))
    }
}

export const ToastEmitterHTML = (type,html) =>{
  if(type ==='success'){
      return toast.success(capitalizeFirstLetter(html))
  }else{
      return toast.error(html)
  }
}

export const ToastContainer = () => {
  return   <Toaster  position="top-right"
  reverseOrder={false}/>
};