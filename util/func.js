import { ToastEmitter } from "./Toast";

import { siteType } from "@/config/siteType";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { socketURLAdminBackend } from "./proxy";
import toast from "react-hot-toast";
export function isJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export function isExpiredValid(iatTimestamp, expTimestamp) {
  const currentTimestamp = Math.floor(Date.now() / 1000) // Convert current date to Unix timestamp in seconds
  return currentTimestamp >= iatTimestamp && currentTimestamp <= expTimestamp
}
export function validateDates(currentDateStr, expireDateStr) {
  // Convert date strings to Date objects
  const currentDate = new Date(currentDateStr);
  const expireDate = new Date(expireDateStr);

  // Check if the current date is before the expiration date
  if (currentDate < expireDate) {
    return true;  // The item is still within the valid period.
  } else if (currentDate.toDateString() === expireDate.toDateString()) {
    return true;  // The item expires today.
  } else {
    return false;  // The item has expired.
  }
}
export const logOut = () => {
  window.window.localStorage.removeItem('token')
  localStorage.removeItem("email");
  window.location.replace('/')

}

export function addressConcat(address) {
  if (address && typeof address === 'object') {
    var formattedAddress =
      ((address.streetNumber?address.streetNumber+" ":"") + (address?.streetName || '')) +
      ', ' +
      (address?.city || '') +
      ', ' +
      (address?.state || '') +
      ' ' +
      (address?.zipCode || '')

    return formattedAddress.replace(/^,/, '');
  } else {
    return ''
  }
}

/// function  for checking coupon is valid or not to product.
export const isCouponValid = (coupon, cartProducts, dontCheckProduct) => {
  const isExpired = coupon.expiry && new Date(coupon.expiry) <= new Date();
  const isQuantityExceeded = coupon.quantity !== null && coupon.totalUses >= coupon.quantity;

  if (isExpired || isQuantityExceeded) {
    return {
      success: false,
      message: isExpired ? "The coupon has expired." : "The coupon has reached its usage limit.",
    };
  }

  if (dontCheckProduct || coupon.enableAllProducts) {
    return { success: true, message: "Coupon has been applied" };
  }

  const couponProductsSet = new Set(coupon.products.map((e) => e.toString()));

  for (let product of cartProducts) {
    if (couponProductsSet.has(product?.product? product?.product?.toString():product.toString())) {
      return { success: true, message: "Coupon has been applied" };
    }
  }

  return {
    success: false,
    message: "The coupon does not apply to any product in the cart.",
  };
};

export const isValidArray = (array) => {
  if (Array.isArray(array) && array.length > 0) return true;
  return false;
};

export const firstNameGet = obj => {
  const keys = 'receiverName.firstName'.split('.');
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return '';
    }
  }

  return value || '';
}

export const lastNameGet = obj => {
  const keys = 'receiverName.lastName'.split('.');
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return '';
    }
  }

  return value || '';
};

export function ProfileAvatarOutput(image, defaultImageUrl = "https://i.ibb.co/TWWL8dc/6870c19d830dd8dddeb6a4e140e995af.jpg") {
  if (!image) return defaultImageUrl;
  const imageUrlRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

  if (imageUrlRegex.test(image)) {
    // If the input image URL is valid, return it
    return image;
  } else {
    // If the input image URL is invalid, return the default image URL
    return defaultImageUrl;
  }
}
export function ProductImageOutput(images, defaultImageUrl = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg") {


  if (!(Array.isArray(images) && images?.length > 0)) return defaultImageUrl;

  const inputImageUrl = images.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))[0]?.imgUrl

  // Regular expression to check if the input is a valid image URL
  const imageUrlRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp|svg|ico|heic|heif|avif)$/i;

  if (imageUrlRegex.test(inputImageUrl)) {
    // If the input image URL is valid, return it
    return inputImageUrl;
  } else {
    // If the input image URL is invalid, return the default image URL
    return defaultImageUrl;
  }
}
export function ImageOutput(images, defaultImageUrl = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg") {
  if (!(Array.isArray(images) && images?.length > 0)) return defaultImageUrl;
  const inputImageUrl = images.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))[0]?.imgUrl
  if (inputImageUrl) {
    // If the input image URL is valid, return it
    return inputImageUrl;
  } else {
    // If the input image URL is invalid, return the default image URL
    return defaultImageUrl;
  }
}

export const getProductQuantity = (cartsArr, productId) => {

  if (!(Array.isArray(cartsArr) && cartsArr?.length)) return 1

  const existingProduct = cartsArr.find(item => (item?.productId || item?._id) === productId);
  if (existingProduct) {
    return existingProduct.quantity
  } else {
    return 1
  }
}

export const getProductQuantityToTotalSaving = (myCarts, productCarts, shippingSelect = {}) => {
  if (!(Array.isArray(myCarts) && myCarts?.length)) return parseFloat(0).toFixed(2)
  const totalSaving = myCarts.reduce((acc, curr) => {

    if (curr?.availability?.isInternational === true) {
      const discount = parseFloat(curr?.price?.regular) *
        parseFloat(getProductQuantity(productCarts, curr?._id) || 0) - parseFloat(curr?.price?.sale) *
        parseFloat(getProductQuantity(productCarts, curr?._id) || 0)
      return acc + discount;
    } else {
      if (isValidArray(curr?.availability?.countries) && curr?.availability?.countries.some(item => item?.country?.value == shippingSelect?.value)) {
        const discount = parseFloat(curr?.price?.regular) *
          parseFloat(getProductQuantity(productCarts, curr?._id) || 0) - parseFloat(curr?.price?.sale) *
          parseFloat(getProductQuantity(productCarts, curr?._id) || 0)
        return acc + discount;
      }
      return acc

    }

  }, 0)
  return parseFloat(totalSaving || 0).toFixed(2)
}
export const getTotalProductQuantityStorage = () => {

  if (typeof window !== 'undefined') {

    let cartItems = [];

    const storedCart = window.localStorage.getItem('cart');

    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (error) {
        window.localStorage.removeItem('cart');
      }
    }
    if (Array.isArray(cartItems) && cartItems?.length > 0) {
      // console.log(cartItems,'storedCart')
      var result = cartItems.reduce(function (acc, obj) {
        return acc + obj?.quantity
      }, 0);
      return result
    } else return 0

  } else {
    return 0
  }


}


export const isAlreadyCartExist = (arr, productId) => {

  if (!arr?.length) return false
  const existingProduct = arr.find(item => {
    if (item.productId === productId) {
      return true
    } else {
      return false
    }
  });
  if (existingProduct) {
    return true
  } else {
    return false
  }

}

export const ProductAddToCartProductStorage = (productId, quantity, notify = true) => {
  try {
    if (!productId) {
      if (notify) {
        return ToastEmitter('error', 'Invalid input. Please provide a valid product ID.')
      }
      return
    }

    let cartItems = [];
    const storedCart = window.localStorage.getItem('cart');

    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (error) {
        window.localStorage.removeItem('cart');
      }
    }

    const existingProductIndex = cartItems.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
      // If the product is found in the cart, update its state

      cartItems[existingProductIndex].quantity = cartItems[existingProductIndex]?.quantity + quantity;
    } else {
      // If the product is not found in the cart, add a new item
      cartItems.push({ productId, quantity });
    }

    window.localStorage.setItem('cart', JSON.stringify(cartItems));

    if (notify) {
      return ToastEmitter('success', 'Product added to cart successfully.')
    }
    return


  } catch (error) {
    if (notify) {
      return ToastEmitter('error', 'Failed to update cart. Please try again.')
    }
    return
  }

}


export const ProductAddToCartProductQuantityStorage = (productId, quantity, notify = true) => {
  try {
    if (!productId) {
      if (notify) {
        return ToastEmitter('error', 'Invalid input. Please provide a valid product ID.')
      }
      return
    }

    let cartItems = [];
    const storedCart = window.localStorage.getItem('cart');

    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (error) {
        window.localStorage.removeItem('cart');
      }
    }

    const existingProductIndex = cartItems.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
      // If the product is found in the cart, update its state

      cartItems[existingProductIndex].quantity = quantity;
    } else {
      // If the product is not found in the cart, add a new item
      cartItems.push({ productId, quantity });
    }

    window.localStorage.setItem('cart', JSON.stringify(cartItems));

    if (notify) {
      return ToastEmitter('success', 'Product added to cart successfully.')
    }
    return


  } catch (error) {
    if (notify) {
      return ToastEmitter('error', 'Failed to update cart. Please try again.')
    }
    return
  }

}

export const ProductAddToCartProductQuantitySubTrackStorage = (productId, quantity, notify = true) => {
  try {
    if (!productId) {
      if (notify) {
        return ToastEmitter('error', 'Invalid input. Please provide a valid product ID.')
      }
      return
    }

    let cartItems = [];
    const storedCart = window.localStorage.getItem('cart');

    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (error) {
        window.localStorage.removeItem('cart');
      }
    }

    const existingProductIndex = cartItems.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
      // If the product is found in the cart, update its state

      cartItems[existingProductIndex].quantity = quantity;
    } else {
      // If the product is not found in the cart, add a new item
      cartItems.push({ productId, quantity });
    }

    window.localStorage.setItem('cart', JSON.stringify(cartItems));

    if (notify) {
      return ToastEmitter('success', 'Product added to cart successfully.')
    }
    return


  } catch (error) {
    if (notify) {
      return ToastEmitter('error', 'Failed to update cart. Please try again.')
    }
    return
  }

}
export const ProductRemoveFromCartProductStorage = (productId, notify = true) => {
  try {
    if (!productId) {
      if (notify) return ToastEmitter('error', 'Invalid input. Please provide a valid product')
      return
    }

    let cartItems = [];
    const storedCart = window.localStorage.getItem('cart');

    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (error) {
        window.localStorage.removeItem('cart');
      }
    }

    const updatedCart = cartItems.filter(item => item.productId !== productId);

    window.localStorage.setItem('cart', JSON.stringify(updatedCart));
    if (notify) {
      return ToastEmitter('success', 'Product removed from cart successfully.')
    }
    return

  } catch (error) {
    // console.log(error)
    if (notify) {
      return ToastEmitter('error', 'Failed to update cart. Please try again.')
    }
    return
  }
};

export function freeShippingCheck(
  subTotalPrice,
  freeShippingCost,
  shippingCost) {
  console.log("FreeShipping::", subTotalPrice);
  if (parseFloat(subTotalPrice) >= parseFloat(freeShippingCost)) {
    return {
      isFreeShipping: true,
      shippingCost: 0,
      message: '"Congratulations! You qualify for free shipping."'
    }
  } else {
    // Calculate total amount by adding shipping cost to subtotal
    return {
      isFreeShipping: false,
      shippingCost: shippingCost,
      message: `Unfortunately, free shipping is not applicable. A shipping cost of $${shippingCost} will be added. Your total amount is ${shippingCost}`,
    }
  }
}

function isValidObject(o) {
  return !!Object.keys(o || {}).length
}

export const SumTotalProductPrice = (myCarts, cartsArr, shippingSelect = {}) => {
  console.log("myCarts", myCarts, "cartsArr", cartsArr, "shippingSelect", shippingSelect)
  // console.log(shippingSelect,'shippingSelect')
  if (Array.isArray(myCarts) && myCarts?.length > 0) {
    var result = myCarts.reduce(function (acc, obj) {
      if (obj?.availability?.isInternational === true) {
        return parseFloat(acc) + obj?.price?.sale * (getProductQuantity(cartsArr, obj?._id))
      } else {
        if (!isValidObject(shippingSelect) || (isValidArray(obj?.availability?.countries) && obj?.availability?.countries.some(item => item?.country?.value == shippingSelect?.value))) {
          return parseFloat(acc) + obj?.price?.sale * (getProductQuantity(cartsArr, obj?._id))
        }
        return acc

      }
    }, 0);
    return parseFloat(result).toFixed(2)
  } else return parseFloat(0).toFixed(2)

}


export function calculateTotalAmountWithCouponProducts(myCarts = [], cartsArr = [], couponProductsArr = [], shippingCost = 0, discount = 0, shippingSelect = {}) {
  const filterMyCartsDiscloseCouponAmount = myCarts
    .filter(item => !couponProductsArr.includes(item._id))
    .reduce((acc, curr) => {
      if (curr?.availability?.isInternational === true) {
        return acc + (parseFloat(curr?.price?.sale) || 0) * getProductQuantity(cartsArr, curr?._id)
      } else {
        if (!isValidObject(shippingSelect) || (isValidArray(curr?.availability?.countries) && curr?.availability?.countries.some(item => item?.country?.value == shippingSelect?.value))) {
          return acc + (parseFloat(curr?.price?.sale) || 0) * getProductQuantity(cartsArr, curr?._id)
        }
        return acc
      }

    }, 0);

  const totalCouponProductAmount = myCarts
    .filter(item => couponProductsArr.includes(item._id))
    .reduce((acc, curr) => {

      if (curr?.availability?.isInternational === true) {
        return acc + (curr?.price?.sale || 0) * getProductQuantity(cartsArr, curr?._id)
      } else {
        if (!isValidObject(shippingSelect) || (isValidArray(curr?.availability?.countries) && curr?.availability?.countries.some(item => item?.country?.value == shippingSelect?.value))) {
          return acc + (curr?.price?.sale || 0) * getProductQuantity(cartsArr, curr?._id)
        }
        return acc
      }

    }, 0);


  const couponFinalAmount = applyDiscount(totalCouponProductAmount, discount);
  const totalCouponProductDiscount = totalCouponProductAmount - couponFinalAmount;

  const finalAmount = (filterMyCartsDiscloseCouponAmount + couponFinalAmount) === 0 ? 0 : (filterMyCartsDiscloseCouponAmount + couponFinalAmount) + shippingCost
  return {
    finalAmount: finalAmount,
    discountedCouponAmount: totalCouponProductDiscount,
  };
}


export function applyDiscount(originalPrice, discountPercentage) {
  const parsedOriginalPrice = parseFloat(originalPrice);
  const parsedDiscountPercentage = parseFloat(discountPercentage);

  if (isNaN(parsedOriginalPrice) || isNaN(parsedDiscountPercentage)) {
    return 0
  }

  const discountDecimal = parsedDiscountPercentage / 100;
  const discountedPrice = parsedOriginalPrice - (parsedOriginalPrice * discountDecimal);

  const roundedDiscountedPrice = Math.round(discountedPrice * 100) / 100;

  return roundedDiscountedPrice;
}


//copy text
export function copyToClipboard(text) {
  if (!text) return ""
  if (typeof document !== 'undefined') {
    var textArea = document.createElement("textarea");
    textArea.value = text.trim();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    ToastEmitter('success', 'Copy to clipboard')
    return true
  } else {
    ToastEmitter('error', 'Copy to clipboard failed! please try again')
    return false
  }
}

export const isValidShipping = (product, shipping) => {
  if (!shipping) return true;
  if (!product?._id) return false
  if (product?.availability?.isInternational === true) {
    return true
  } else {
    if (isValidArray(product?.availability?.countries) && product?.availability?.countries.some(item => item?.country?.value == shipping?.value)) {
      return true
    }
    return false
  }
}

export const getFullCountryName = (Cname) => {
  if (!Cname) return "";
  try {
    let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(Cname);
  } catch (error) {

    return "";
  }
};


export function validateEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


export const convertSlugToTitle = (slug) => {
  // Check if the slug is empty or undefined
  if (!slug) return 'Home'; // Default title

  // Split the slug into words separated by hyphens
  const words = slug.split('-');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
    // Check if the word is empty or consists of only hyphens
    if (!word.replace(/-/g, '')) return ''; // Skip empty word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back together with spaces
  return capitalizedWords.join(' ');
};


export function ProductPaginate(array, page_number, page_size) {
  if (!isValidArray(array)) return []
  // Calculate start and end indices for the current page
  const start_index = (page_number - 1) * page_size;
  const end_index = start_index + page_size;

  // Slice the array to get the subset for the current page
  return array.slice(start_index, end_index);
}


export const downloadZip = async (files) => {
  if (!isValidArray(files)) return '';

  const zip = new JSZip();
  const promises = files.map(async file => {
  try {
    console.log(viewFileSrc(file.url))
    const response = await fetch(viewFileSrc(file.url));
    const blob = await response.blob();
    zip.file(file.name, blob);
  } catch (error) {
    
  }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  // Generate the ZIP file and trigger download
  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, 'files.zip');
  });
};

export function downloadFile(url, filename) {
  if (!url) return;
  // Fetch the file
  fetch(viewFileSrc(url))
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      return response.blob();
    })
    .then(blob => {
      // Save the file using file-saver
      saveAs(blob, filename);
    })
    .catch(error => {
      console.log(viewFileSrc(url))
      console.error('Error downloading file:', error);
    });
}


export const viewFileSrc = (file) => {
  if (!file) return ""
  return file.startsWith('uploads/') ? `${socketURLAdminBackend}/${file}` : file

}
export const slugToTitle = (slug) => {
  // Check if the slug is empty or undefined
  if (!slug) return ''; // Default title

  // Split the slug into words separated by hyphens
  const words = slug.split('-');
  
  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
    // Check if the word is empty or consists of only hyphens
    if (!word.replace(/-/g, '')) return ''; // Skip empty word
    return word.charAt(0).toUpperCase()  + word.slice(1).toLowerCase();
  });
  
  // Join the words back together with spaces
  return capitalizedWords.join(' ');
};


export const getProductIncludeData=(arr)=>{

  // console.log(arr,'ar')
  return isValidArray(arr)?arr.filter(item=> item?.product?.site ==siteType) :[]
}



export const copyCoponToClipboard= async (code)=>{
  try {

    await navigator.clipboard.writeText(code)
    toast.success("Coupon code copied")

    } catch (error) {
     toast.error("Failed to copy text")
     console.error(error)
  }
}

export const getUnitByProductName = (name)=> {
  if(!name) {
    return "VIAL";
  }
  if(name.toUpperCase()=="AUCTROPIN 120IU HGH" || name.toUpperCase()=="AUCTROPIN 40IU") {
    return "KIT";
  } else if(name.toUpperCase()=="HCG 15,000IU") {
    return "BOX";
  } else {
    return "VIAL";
  }
}