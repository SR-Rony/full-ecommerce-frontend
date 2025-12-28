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
import { Dialog, Transition } from '@headlessui/react';
import _ from "lodash";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoClose, IoWarningOutline } from "react-icons/io5";
const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const ShippingModal = ({ onSuccess, isOpen, setIsOpen, setLoginModalOpen, setRegisterModalOpen }: any) => {

  return (
    <>
      <Transition.Root show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed w-full inset-0 z-[50] overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          {/* Background overlay */}
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          </Transition.Child>

          {/* Modal content container */}
          <div className="fixed w-full inset-0 z-[50] overflow-auto p-4">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="max-w-2xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-xl">

                <OnlyShippingModal onSuccess={onSuccess} setClose={setIsOpen} setLoginModalOpen={setLoginModalOpen} setRegisterModalOpen={setRegisterModalOpen} />


              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

    </>

  );
};

export default ShippingModal;




const OnlyShippingModal = ({ onSuccess, setClose, setLoginModalOpen, setRegisterModalOpen }: any) => {
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
          setClose(false)
        } else {
          localStorage.setItem("alert_on_price_change", "true");
          // router.push("/carts");
          setClose(false)
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
          setClose(false)
        } else {
          localStorage.setItem("alert_on_price_change", "true");
          // router.push("/carts");
          setClose(false)
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
        <div className="h-100  rounded-lg py-4 mt-28">
          <Loader bg="transparent" />
        </div>
      ) : (
        <div className="w-full md:mx-auto">
          <div className='flex items-center justify-between w-[100%]  mx-auto bg-white px-4 py-4 rounded-md'>
            <p className=' text-md md:text-[25px] font-semibold text-center uppercase rounded-md'>
              Edit/Add Address Info
            </p>
            <IoClose size={25} className='cursor-pointer' onClick={() => setClose(false)} />

          </div>
          <hr className='w-[94%] mx-auto' />
          <div className="text-black bg-white rounded-md px-5  py-3  mt-3 space-y-2">

            <div className="">
              <div className="flex flex-col md:flex-row   md:items-end gap-4 ">
                <div className="md:w-6/12 space-y-2 ">
                  <label htmlFor="" className="font-[400] text-[17.4px]">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    defaultValue={authData?.firstName || ""}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 rounded-md border border-black bg-[#F2F2F2] text-sm"
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
                <div className="md:w-6/12 space-y-2">
                  <label htmlFor="" className="font-[400] text-[17.4px]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    defaultValue={authData?.lastName || ""}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 rounded-md border-black bg-[#F2F2F2] border text-sm"
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
            </div>
            {sub ? (
              <div key={selectedAddress}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-6/12">
                    <label htmlFor="" className="font-[400] text-[17.4px]">
                      Address
                    </label>
                    <p className="text-[12px]">
                      If your address is not shown in the dropdown or you need
                      to modify it, just type it manually.
                    </p>
                    <div className="relative ">
                      <input
                        type="text"
                        value={searchInputValue || ""}
                        className="text-sm w-full p-2 rounded-md my-2 border border-black bg-[#F2F2F2]"
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
                          <div className="absolute py-2 px-4 bg-white w-full rounded-md border border-gray-400">
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
                    <label htmlFor="" className="font-[400] text-[17.4px]">
                      APT OR UNIT NUMBER (Optional)
                    </label>
                    <input
                      type="text"
                      value={selectedAddress?.aptUnit || ""}
                      onChange={(e) => onChange("aptUnit", e.target.value)}
                      className="text-sm w-full p-2 rounded-md my-2  md:mt-11 border border-black bg-[#F2F2F2]"
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
                <div className="flex items-center gap-1">
                  <IoWarningOutline size={35} />  <p className="text-red-500 mt-2 font-normal">NO PO BOXES. IF YOUR ADDRESS FORWARDS TO A PO BOX, USE AN ADDRESS THAT ACCEPTS MAIL.</p>
                </div>
                <div className="py-5 mt-4">
                  {saveAptUnitRequest ? (
                    <Loader />
                  ) : (
                    <button
                      className="bg-black  text-white p-3 py-4 block mx-auto font-[600] max-w-[521px] text-[15px] md:text-[24.6px] rounded-md  px-5 w-full  md:px-10 shadow-md  hover:scale-105 duration-300 cursor-pointer"
                      onClick={() => handleSaveSelectedAddress()}
                    >
                      CLICK TO CONFIRM ADDRESS INFO
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid md:grid-cols-2 gap-3 py-3">
                  <div className=" py-2">
                    <p className="py-1 font-bold">City</p>
                    <input
                      type="text"
                      placeholder="City"
                      defaultValue={selectedAddress?.city || ""}
                      className="w-full border p-2 rounded-md text-sm border-gray-600 "
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
                    <p className="py-1 font-bold">State</p>
                    <input
                      type="text"
                      placeholder="State"
                      defaultValue={selectedAddress?.state || ""}
                      className="w-full border p-2 rounded-md text-sm border-gray-600 "
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
                    <p className="py-1 font-bold">Zip Code</p>
                    <input
                      type="text"
                      placeholder="Zip"
                      defaultValue={selectedAddress?.zipCode || ""}
                      className="w-full border p-2 rounded-md text-sm border-gray-600 "
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
                    <p className="py-1 font-bold"> Street Number</p>
                    <input
                      type="text"
                      placeholder="Street Number"
                      defaultValue={selectedAddress?.streetNumber || ""}
                      className="w-full border p-2 rounded-md text-sm border-gray-600 "
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
                    <p className="py-1 font-bold">Street Name</p>
                    <input
                      type="text"
                      placeholder="Street Name"
                      defaultValue={selectedAddress?.streetName || ""}
                      className="w-full border p-2 rounded-md text-sm border-gray-600 "
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
                    <p className="py-1 font-bold">
                      APT OR UNIT NUMBER (Optional)
                    </p>
                    <input
                      type="text"
                      placeholder="Type Apt or Unit Here"
                      defaultValue={selectedAddress?.aptUnit || ""}
                      className="w-full border p-2 rounded-md text-sm border-gray-600 "
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
                <div className="flex items-center gap-1">
                  <IoWarningOutline size={35} />  <p className="text-red-500 font-normal">NO PO BOXES. IF YOUR ADDRESS FORWARDS TO A PO BOX, USE AN ADDRESS THAT ACCEPTS MAIL.</p>
                </div>
                <div className="text-sm flex justify-end gap-3 ">
                  <button onClick={() => setSub(true)}>close</button>
                  {addressSaveRequest ? (
                    <Loader />
                  ) : (
                    <button
                      className="border px-3 py-2 border-gray-400 rounded-md"
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
      {/* <div className="pb-[50px] md:pb-[45vh]" /> */}
    </>
  );
};