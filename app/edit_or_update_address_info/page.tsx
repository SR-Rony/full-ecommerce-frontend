"use client";
import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { ToastEmitter } from "@/util/Toast";
import { addressConcat } from "@/util/func";
import {
  MyShippingAddressApi,
  MyShippingAddressUpdateApi,
  PublicShippingAddressSearchApi,
} from "@/util/instance";
import _ from "lodash";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoIosInformationCircleOutline, IoIosWarning } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { PiWarningCircle } from "react-icons/pi";
const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const EditOrUpdateAddressInfo = ({ onSuccess }: { onSuccess: any }) => {
  const [sub, setSub] = useState(true);
  const router = useRouter();
  const { MyShippingAddress, Auth } = useFullStage();
  const [authData, setAuthData] = Auth;
  const [myShippingAddress, setMyShippingAddress] = MyShippingAddress?.Address;
  const [isRequest, setIsRequest] = useState(true);
  const [addressSaveRequest, setAddressSaveRequest] = useState(false);
  const [nameSaveRequest, setNameSaveRequest] = useState(false);
  const [saveAptUnitRequest, setSaveAptUnitRequest] = useState(false);
  const [searchInputValue, setSearchValue] = useState("");
  const [searchAddressArr, setSearchAddressArr] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<any>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const firstNameInputRef: any = useRef();
  const lastNameInputRef: any = useRef();
  const addressInputRef: any = useRef();
  const cityInputRef: any = useRef();
  const stateInputRef: any = useRef();
  const zipCodeInputRef: any = useRef();
  const streetNumberInputRef: any = useRef();
  const streetNameInputRef: any = useRef();
  const aptUnitInputRef: any = useRef();

  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "Shipping Address | Hammer and Bell";
    }
  }, []);
  const formatAddressObject = (addr: any) => {
    return {
      city: addr.city || "",
      aptUnit: addr.aptUnit || "",
      state: addr.state || "",
      zipCode: addr.zipCode || "",
      streetName: addr.streetName || "",
      streetNumber: addr.streetNumber || "",
    };
  };

  const handleSaveShippingAddress = async () => {
    try {
      if (!Object.values(selectedAddress).filter((e) => e).length) {
        addressInputRef.current.focus();
        ToastEmitter("error", "Address details can't be empty.");
        return;
      }
      if (!firstName) {
        firstNameInputRef.current.focus();
        ToastEmitter("error", "Please enter your first name!");
        return;
      }
      if (!lastName) {
        lastNameInputRef.current.focus();
        ToastEmitter("error", "Please enter your last name!");
        return;
      }
      setIsRequest(false);
      setAddressSaveRequest(true);
      await new Promise((resolve: any) => setTimeout(resolve, 1000));
      const res = await MyShippingAddressUpdateApi({
        ...selectedAddress,
        firstName,
        lastName,
      });
      setAddressSaveRequest(false);
      setSub(true);

      if (res?.data?.success) {
        ToastEmitter("success", res?.data?.message);
        res.data.data["email"] = authData.email || res?.data?.data?.email;
        const token = res?.data?.data?.token;
        window.localStorage.setItem("token", token);
        setMyShippingAddress(res.data.data);
        if (onSuccess) {
          onSuccess(res.data.data);
        } else {
          localStorage.setItem("alert_on_price_change", "true");
          router.push("/carts");
        }
      } else {
        ToastEmitter("error", res?.data?.message);
      }
    } catch (error) {
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  };

  const handleSaveSelectedAddress = async () => {
    try {
      if (!Object.values(selectedAddress).filter((e) => e).length) {
        ToastEmitter("error", "No address selected.");
        return;
      }
      if (!firstName || !lastName) {
        ToastEmitter("error", "FirstName and LastName are required.");
      }

      setIsRequest(false);
      setAddressSaveRequest(false);
      setSaveAptUnitRequest(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await MyShippingAddressUpdateApi({
        ...selectedAddress,
        firstName,
        lastName,
      });
      setSaveAptUnitRequest(false);
      if (res?.data?.success) {
        ToastEmitter("success", "Selected address save successfully!");
        res.data.data["email"] = authData.email || res?.data?.data?.email;
        const token = res?.data?.data?.token;
        window.localStorage.setItem("token", token);
        setMyShippingAddress(res.data.data);
        if (onSuccess) {
          onSuccess(res.data.data);
        } else {
          localStorage.setItem("alert_on_price_change", "true");
          router.push("/carts");
        }
      } else {
        ToastEmitter("error", res?.data?.message);
      }
    } catch (error) {
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  };

  const fetchMyShippingAddress = async () => {
    try {
      setIsRequest(true);
      setAddressSaveRequest(false);
      const res = await MyShippingAddressApi();
      setIsRequest(false);
      if (res?.data?.success) {
        // ToastEmitter('success', res?.data?.message)
        res.data.data["email"] = authData.email || res?.data?.data?.email;
        setSelectedAddress(formatAddressObject(res.data.data))
        setFirstName(res.data.data?.receiverName?.firstName);
        setLastName(res.data.data?.receiverName?.lastName);
        setMyShippingAddress(res.data.data);
      } else {
        // ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  };

  const fetchPublicShippingAddressApi = async (value: any) => {
    try {
      const res = await PublicShippingAddressSearchApi(value);
      if (Array.isArray(res?.data?.results) && res.data.results.length) {
        const mappedData = res.data.results.map((entity: any) => {
          const {
            freeformAddress,
            address: {
              countrySubdivision,
              countrySubdivisionName,
              municipalitySubdivision,
              countrySecondarySubdivision,
              postalCode,
              zipCode,
              countryCode,
              municipality,
              streetNumber,
              streetName,
            },
          } = entity;

          const city = municipality || municipalitySubdivision || null;
          const state =
            countrySubdivision ||
            countrySubdivisionName ||
            countrySecondarySubdivision ||
            null;
          const zip = postalCode || zipCode || null;
          const country = {
            label: countryCode || null,
            value: countryCode || null,
          };

          return _.omitBy(
            {
              str: freeformAddress,
              streetNumber,
              streetName,
              aptUnit: entity.aptUnit || null,
              city,
              country,
              state,
              zipCode: zip,
            },
            _.isNil
          );
        });

        setSearchAddressArr(mappedData);
      }
    } catch (error) {
      setSearchAddressArr([]);
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  };

  const onChange = (key: any, value: any) => {
    setSelectedAddress((prev: any) => {
      return formatAddressObject({
        ...prev,
        [key]: value,
      });
    });
  };

  useEffect(() => {
    fetchMyShippingAddress();
    setIsRequest(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myShippingAddress?._id]);

  const handleAddressSearch = async (value: any) => {
    await fetchPublicShippingAddressApi(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(_.debounce(handleAddressSearch, 1000), []);

  function handleChange(event: any) {
    setSearchValue(event.target.value);
    debounceFn(event.target.value);
  }

  useMemo(() => {
    if (authData?._id) {
      setAuthData(authData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData?._id]);

  return (
    <>
 
 {isRequest ? (
        <div className="h-100  rounded-lg ">
          <Loader bg="transparent" />
        </div>
      ) : (
        <div className="max-w-[720px] w-11/12  mx-auto  mt-10 ">
          <div className="text-black bg-white rounded-md p-4 md:p-8   space-y-2">
          
              <div className="flex flex-col md:flex-row   md:items-end gap-4  ">
                <div className="md:w-6/12  ">
                  <label htmlFor="" className="font-[400] text-[15px] text-gray-500">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    defaultValue={authData?.firstName || ""}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150"
                    placeholder="Type your First Name"
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        if (e.target.value) {
                          lastNameInputRef.current.focus();
                        } else {
                          ToastEmitter(
                            "error",
                            "Please enter your first name!"
                          );
                        }
                      }
                    }}
                    ref={firstNameInputRef}
                  />
                </div>
                <div className="md:w-6/12 ">
                  <label htmlFor="" className="font-[400] text-[15px] text-gray-500">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    defaultValue={authData?.lastName || ""}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150"
                    placeholder="Type your Last Name"
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        if (e.target.value) {
                          if (sub) {
                            addressInputRef.current.focus();
                          } else {
                            cityInputRef.current.focus();
                          }
                        } else {
                          ToastEmitter("error", "Please enter your last name!");
                        }
                      }
                    }}
                    ref={lastNameInputRef}
                  />
                </div>
              </div>
           
            {sub ? (
              <div key={selectedAddress}>
                <div className="flex flex-col md:flex-row gap-4 pt-6 pb-8">
                  <div className="md:w-6/12">
                    <label htmlFor="" className="font-[400] text-[15px] text-gray-500">
                      Address
                    </label>
                    <p className="text-[12px]">
                      If your address is not shown in the dropdown or you need
                      to modify it, just type it manually.
                    </p>
                    <div className="relative my-2 ">
                      <input
                        type="text"
                        value={searchInputValue || ""}
                        className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150 "
                        placeholder="Type address"
                        onChange={handleChange}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            if (e.target.value) {
                              if (
                                !Object.values(selectedAddress).filter((e) => e)
                                  .length
                              ) {
                                ToastEmitter(
                                  "error",
                                  "Please select your address!"
                                );
                              } else {
                                aptUnitInputRef.current.focus();
                              }
                            } else {
                              ToastEmitter(
                                "error",
                                "Please select your address!"
                              );
                            }
                          }
                        }}
                        ref={addressInputRef}
                      />
                      {Array.isArray(searchAddressArr) &&
                        searchAddressArr?.length > 0 && (
                          <div className="absolute py-2 px-4 bg-white w-full rounded-md border border-gray-400  ">
                            {searchAddressArr.map((address, i) => (
                              <p
                                key={i}
                                className="cursor-pointer py-2 border-b"
                                onClick={() => {
                                  // setMyShippingAddress({
                                  //   ...myShippingAddress,
                                  //   ...address,
                                  // });
                                  console.log("address object ", address);
                                  setSelectedAddress(
                                    formatAddressObject(address)
                                  );
                                  setSearchValue(addressConcat(address));
                                  setSearchAddressArr([]);
                                }}
                              >
                                {" "}
                                {addressConcat(address)}{" "}
                              </p>
                            ))}
                          </div>
                        )}
                    </div>
                    <p className="text-xs">
                      Cant find address?{" "}
                      <button
                        onClick={() => setSub(false)}
                        className="font-semibold"
                      >
                        {" "}
                        Click here to type it manually
                      </button>
                    </p>{" "}
                  </div>

                  <div className="md:w-6/12">
                    <label htmlFor="" className="font-[400] text-[15px] text-gray-500">
                      APT OR UNIT NUMBER (Optional)
                    </label>
                    <input
                      type="text"
                      value={selectedAddress?.aptUnit || ""}
                      onChange={(e) => onChange("aptUnit", e.target.value)}
                      className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150 my-2  md:mt-11"

  
                      placeholder="Type Apt or Unit Here"
                      onKeyDown={async (e: any) => {
                        if (e.key === "Enter") {
                          await handleSaveSelectedAddress();
                        }
                      }}
                      ref={aptUnitInputRef}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 my-4 py-4 px-6 bg-[#FFEECD] rounded-md ">
                  <PiWarningCircle   className="p-[7px] bg-[#FFA52D] text-black  w-10 h-10 rounded-full"/>  
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-black">Mail Delivery Notice</h2>
                  <p className="    text-gray-70 font-medium text-xs">NO PO BOXES. IF YOUR ADDRESS FORWARDS TO A PO BOX, USE AN ADDRESS THAT ACCEPTS MAIL.</p>
                  </div>
                </div>
                <div className="  mt-4">
                  {saveAptUnitRequest ? (
                    <Loader />
                  ) : (
                    <div className="flex items-center gap-3 text-sm justify-end">

                    <button
                    className="  text-black px-6 py-2 rounded-full   border border-black/50 hover:opacity-80 duration-150 "
                    onClick={onSuccess}
                    >
                Back
                    </button>
                    <button
                    className=" bg-black text-white px-6 py-2 rounded-full   border border-black hover:opacity-80 duration-150 "
                    onClick={() => handleSaveSelectedAddress()}
                    >
                     Update
                    </button>
                      </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid md:grid-cols-2 gap-3 py-3">
                  <div className=" py-2">
                  <label htmlFor="" className="font-[400] text-[15px] text-gray-500">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      defaultValue={selectedAddress?.city || ""}
                      className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150"
                      name=""
                      id=""
                      onChange={(e) => onChange("city", e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          if (e.target.value) {
                            stateInputRef.current.focus();
                          } else {
                            ToastEmitter("error", "Please enter your city!");
                          }
                        }
                      }}
                      ref={cityInputRef}
                    />
                  </div>
                  <div className="py-2">
                  <label htmlFor="" className="font-[400] text-[15px] text-gray-500">State</label>
                    <input
                      type="text"
                      placeholder="State"
                      defaultValue={selectedAddress?.state || ""}
                      className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150"
                      name=""
                      id=""
                      onChange={(e) => onChange("state", e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          if (e.target.value) {
                            zipCodeInputRef.current.focus();
                          } else {
                            ToastEmitter("error", "Please enter your state!");
                          }
                        }
                      }}
                      ref={stateInputRef}
                    />
                  </div>

                  <div className="py-2">
                  <label htmlFor="" className="font-[400] text-[15px] text-gray-500">Zip Code</label>
                    <input
                      type="text"
                      placeholder="Zip"
                      defaultValue={selectedAddress?.zipCode || ""}
                      className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150"
                      name=""
                      id=""
                      onChange={(e) => onChange("zipCode", e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          if (e.target.value) {
                            streetNumberInputRef.current.focus();
                          } else {
                            ToastEmitter(
                              "error",
                              "Please enter your zip code!"
                            );
                          }
                        }
                      }}
                      ref={zipCodeInputRef}
                    />
                  </div>
                  <div className="py-2">
                  <label htmlFor="" className="font-[400] text-[15px] text-gray-500"> Street Number</label>
                    <input
                      type="text"
                      placeholder="Street Number"
                      defaultValue={selectedAddress?.streetNumber || ""}
                      className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150"
                      name=""
                      id=""
                      onChange={(e) => onChange("streetNumber", e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          if (e.target.value) {
                            streetNameInputRef.current.focus();
                          } else {
                            ToastEmitter(
                              "error",
                              "Please enter your street number!"
                            );
                          }
                        }
                      }}
                      ref={streetNumberInputRef}
                    />
                  </div>
                  <div className="py-2">
                  <label htmlFor="" className="font-[400] text-[15px] text-gray-500">Street Name</label>
                    <input
                      type="text"
                      placeholder="Street Name"
                      defaultValue={selectedAddress?.streetName || ""}
                      className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150"
                      name=""
                      id=""
                      onChange={(e) => onChange("streetName", e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          if (e.target.value) {
                            aptUnitInputRef.current.focus();
                          } else {
                            ToastEmitter(
                              "error",
                              "Please enter your street name!"
                            );
                          }
                        }
                      }}
                      ref={streetNameInputRef}
                    />
                  </div>
                  <div className="py-2">
                  <label htmlFor="" className="font-[400] text-[15px] text-gray-500">
                      APT OR UNIT NUMBER (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Type Apt or Unit Here"
                      defaultValue={selectedAddress?.aptUnit || ""}
                      className="w-full  rounded py-2 px-4   outline-none border border-gray-200 focus:border-gray-500 duration-150"
                      name=""
                      id=""
                      onChange={(e) => onChange("aptUnit", e.target.value)}
                      onKeyDown={async (e: any) => {
                        if (e.key === "Enter") {
                          await handleSaveShippingAddress();
                        }
                      }}
                      ref={aptUnitInputRef}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 my-4 py-4 px-6 bg-[#FFEECD] rounded-md">
                  <PiWarningCircle   className="p-[7px] bg-[#FFA52D] text-black  w-10 h-10 rounded-full"/>  
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-black">Mail Delivery Notice</h2>
                  <p className="    text-gray-70 font-medium text-xs">NO PO BOXES. IF YOUR ADDRESS FORWARDS TO A PO BOX, USE AN ADDRESS THAT ACCEPTS MAIL.</p>
                  </div>
                </div>
                <div className="text-sm flex justify-end gap-3 ">
                  <button 
                                        className="   text-black px-6 py-2 rounded-full   border border-black/50 hover:opacity-80 duration-150"

                  onClick={() => setSub(true)}>close</button>
                  {addressSaveRequest ? (
                    <Loader />
                  ) : (
                    <button
                      className=" bg-black text-white px-6 py-2 rounded-full   border border-black hover:opacity-80 duration-150"
                      onClick={async () => {
                        await handleSaveShippingAddress();
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
 
     </>
  );
};

export default EditOrUpdateAddressInfo;
