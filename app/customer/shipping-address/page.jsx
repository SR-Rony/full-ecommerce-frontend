"use client";
import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { ToastEmitter } from "@/util/Toast";
import { addressConcat, firstNameGet, lastNameGet } from "@/util/func";
import { IoIosInformationCircleOutline, IoIosWarning } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";

import {
  MyShippingAddressApi,
  MyShippingAddressUpdateApi,
  PublicShippingAddressSearchApi,
} from "@/util/instance";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

const Page = () => {
  const [sub, setSub] = useState(true);
  const { MyShippingAddress, Auth } = useFullStage();
  const [authData, setAuthData] = Auth;
  const [myShippingAddress, setMyShippingAddress] = MyShippingAddress?.Address;
  const [isRequest, setIsRequest] = useState(true);
  const [addressSaveRequest, setAddressSaveRequest] = useState(false);
  const [nameSaveRequest, setNameSaveRequest] = useState(false);
  const [saveAptUnitRequest, setSaveAptUnitRequest] = useState(false);
  const [searchInputValue, setSearchValue] = useState("");
  const [searchAddressArr, setSearchAddressArr] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useMemo(() => {
    if (typeof document !== 'undefined') {
      document.title = 'My Shipping Address | Hammer and Bell'
    }
  }, [])

  const formatAddressObject = (addr) => {
    return {
      city: addr.city || "",
      aptUnit: addr.aptUnit || "",
      state: addr.state || "",
      zipCode: addr.zipCode || "",
      streetName: addr.streetName || "",
      streetNumber: addr.streetNumber || ""
    }
  }

  useEffect(() => {
    console.log("My Shipping Address Changed ", myShippingAddress);
    setFirstName(myShippingAddress?.receiverName?.firstName || "")
    setLastName(myShippingAddress?.receiverName?.lastName || "")
  }, [myShippingAddress])

  const handleSaveShippingAddress = async () => {
    try {
      if (!Object.values(selectedAddress).filter((e) => e).length) {
        ToastEmitter("error", "Address details can't be empty.")
        return;
      }
      setIsRequest(false);
      setAddressSaveRequest(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      const res = await MyShippingAddressUpdateApi(selectedAddress);
      setAddressSaveRequest(false);
      setSub(true);
      if (res?.data?.success) {
        ToastEmitter("success", res?.data?.message);
        res.data.data["email"] = authData.email || res?.data?.data?.email;
        const token = res?.data?.data?.token;
        window.localStorage.setItem('token', token)
        setMyShippingAddress(res.data.data);
      } else {
        ToastEmitter("error", res?.data?.message);
      }
    } catch (error) {
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  };

  const handleSaveShippingAddressReceiverName = async () => {
    try {
      setIsRequest(false);
      setNameSaveRequest(true);
      const res = await MyShippingAddressUpdateApi({
        "receiverName.firstName": firstName,
        "receiverName.lastName": lastName,
      });
      setNameSaveRequest(false);
      if (res?.data?.success) {
        ToastEmitter("success", "Name updated successfully!");
        const token = res?.data?.data?.token;
        window.localStorage.setItem('token', token)
        res.data.data["email"] = authData.email || res?.data?.data?.email;
        setMyShippingAddress(res.data.data);
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
        ToastEmitter("error", "No address selected.")
        return;
      }

      setIsRequest(false);
      setAddressSaveRequest(false);
      setSaveAptUnitRequest(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      const res = await MyShippingAddressUpdateApi(selectedAddress);
      setSaveAptUnitRequest(false);
      if (res?.data?.success) {
        console.log(res?.data?.data?.token)
        ToastEmitter("success", "Selected address save successfully!");
        const token = res?.data?.data?.token;
        window.localStorage.setItem('token', token)
        res.data.data["email"] = authData.email || res?.data?.data?.email;
        setMyShippingAddress(res.data.data);
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
        setMyShippingAddress(res.data.data);
      } else {
        // ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  };

  const fetchPublicShippingAddressApi = async (value) => {
    try {
      const res = await PublicShippingAddressSearchApi(value);
      if (Array.isArray(res?.data?.results) && res.data.results.length) {
        const mappedData = res.data.results.map((entity) => {
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

          return _.omitBy({
            str: freeformAddress,
            streetNumber,
            streetName,
            aptUnit: entity.aptUnit || null,
            city,
            country,
            state,
            zipCode: zip,
          }, _.isNil);
        })

        setSearchAddressArr(mappedData);
      }

    } catch (error) {
      setSearchAddressArr([]);
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  };

  const onChange = (key, value) => {
    setSelectedAddress((prev) => {
      return formatAddressObject({
        ...prev,
        [key]: value,
      });
    });
  };

  useEffect(() => {
    if (!myShippingAddress?._id) {
      fetchMyShippingAddress();
    }
    setIsRequest(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myShippingAddress?._id]);

  const handleAddressSearch = async (value) => {
    await fetchPublicShippingAddressApi(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(_.debounce(handleAddressSearch, 1000), []);

  function handleChange(event) {
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
        <div className="h-100 rounded-lg py-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-300 shadow-lg"></div>
            <p className="text-purple-200 font-mono font-semibold text-lg animate-pulse tracking-wider uppercase">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-8 pt-6 pb-4 space-y-3 shadow-lg">
            <div className="capitalize space-x-2 text-white">
              <span className="text-gray-300">Current Address:</span>{" "}
              <span className="font-bold text-emerald-400 text-lg">
                {addressConcat(myShippingAddress)}
              </span>
            </div>
            <div className="capitalize space-x-2 text-white">
              <span className="text-gray-300">Apartment or Unit:</span>{" "}
              <span className="font-bold text-cyan-400 text-lg">
                {myShippingAddress?.aptUnit || "N/A"}
              </span>
            </div>
            <div className="capitalize space-x-2 text-white">
              <span className="text-gray-300">Current Name for Receiver:</span>{" "}
              <span className="font-bold text-white text-lg">
                {firstNameGet(myShippingAddress)}{" "}
                {lastNameGet(myShippingAddress)}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-6 mt-4 space-y-4 shadow-lg">
            {sub ? (
              <div key={selectedAddress}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-7/12">
                    <label className="block text-white font-semibold mb-2">
                      Address
                    </label>
                    <p className="text-sm text-gray-300 mb-3">
                      If your address is not shown in the dropdown or you need
                      to modify it, just type it manually.
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchInputValue || ""}
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                        placeholder="Type address"
                        onChange={handleChange}
                      />
                      {Array.isArray(searchAddressArr) &&
                        searchAddressArr?.length > 0 && (
                          <div className="absolute py-2 px-4 bg-slate-900 backdrop-blur-xl w-full rounded-xl border border-white/20 mt-1 shadow-xl z-10 max-h-60 overflow-y-auto">
                            {searchAddressArr.map((address, i) => (
                              <p
                                key={i}
                                className="cursor-pointer py-3 border-b border-white/10 text-white hover:text-emerald-400 transition-colors last:border-b-0"
                                onClick={() => {
                                  console.log("address object ", address)
                                  setSelectedAddress(formatAddressObject(address))
                                  setSearchValue(addressConcat(address))
                                  setSearchAddressArr([])
                                }}
                              >
                                {addressConcat(address)}
                              </p>
                            ))}
                          </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-300 mt-2">
                      Can't find address?{" "}
                      <button
                        onClick={() => setSub(false)}
                        className="text-emerald-400 hover:text-cyan-400 font-semibold transition-colors underline"
                      >
                        Click here to type it manually
                      </button>
                    </p>
                  </div>

                  <div className="md:w-5/12">
                    <label className="block text-white font-semibold mb-2">
                      APT OR UNIT NUMBER (Optional)
                    </label>
                    <input
                      type="text"
                      value={selectedAddress?.aptUnit || ""}
                      onChange={(e) => onChange("aptUnit", e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 md:mt-9"
                      placeholder="Type Apt or Unit Here"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                  <IoWarningOutline size={28} className="text-red-400 flex-shrink-0"/>
                  <p className="text-red-300 font-medium">NO PO BOXES. IF YOUR ADDRESS FORWARDS TO A PO BOX, USE AN ADDRESS THAT ACCEPTS MAIL.</p>
                </div>

                <div className="py-5 mt-4">
                  {saveAptUnitRequest ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500/30 border-t-purple-300"></div>
                        <span className="text-purple-200 font-mono text-sm tracking-wide">UPDATING...</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm w-full max-w-[400px] mx-auto block"
                      onClick={() => handleSaveSelectedAddress()}
                    >
                      → UPDATE ADDRESS
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid md:grid-cols-2 gap-4 py-3">
                  <div className="py-2">
                    <label className="block text-white font-semibold mb-2">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      defaultValue={selectedAddress?.city || ""}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                      name=""
                      id=""
                      onChange={(e) => onChange("city", e.target.value)}
                    />
                  </div>
                  <div className="py-2">
                    <label className="block text-white font-semibold mb-2">State</label>
                    <input
                      type="text"
                      placeholder="State"
                      defaultValue={selectedAddress?.state || ""}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                      name=""
                      id=""
                      onChange={(e) => onChange("state", e.target.value)}
                    />
                  </div>

                  <div className="py-2">
                    <label className="block text-white font-semibold mb-2">Zip Code</label>
                    <input
                      type="text"
                      placeholder="Zip"
                      defaultValue={selectedAddress?.zipCode || ""}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                      name=""
                      id=""
                      onChange={(e) => onChange("zipCode", e.target.value)}
                    />
                  </div>
                  <div className="py-2">
                    <label className="block text-white font-semibold mb-2">Street Number</label>
                    <input
                      type="text"
                      placeholder="Street Number"
                      defaultValue={selectedAddress?.streetNumber || ""}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                      name=""
                      id=""
                      onChange={(e) => onChange("streetNumber", e.target.value)}
                    />
                  </div>
                  <div className="py-2">
                    <label className="block text-white font-semibold mb-2">Street Name</label>
                    <input
                      type="text"
                      placeholder="Street Name"
                      defaultValue={selectedAddress?.streetName || ""}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                      name=""
                      id=""
                      onChange={(e) => onChange("streetName", e.target.value)}
                    />
                  </div>
                  <div className="py-2">
                    <label className="block text-white font-semibold mb-2">APT OR UNIT NUMBER (Optional)</label>
                    <input
                      type="text"
                      placeholder="Type Apt or Unit Here"
                      defaultValue={selectedAddress?.aptUnit || ""}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      name=""
                      id=""
                      onChange={(e) => onChange("aptUnit", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                  <IoWarningOutline size={28} className="text-red-400 flex-shrink-0"/>
                  <p className="text-red-300 font-medium">NO PO BOXES. IF YOUR ADDRESS FORWARDS TO A PO BOX, USE AN ADDRESS THAT ACCEPTS MAIL.</p>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    onClick={() => setSub(true)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white px-6 py-2 rounded-xl transition-all duration-300 font-medium"
                  >
                    Close
                  </button>
                  {addressSaveRequest ? (
                    <div className="flex items-center gap-2 px-6 py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-300 border-t-white"></div>
                      <span className="text-purple-200">Saving...</span>
                    </div>
                  ) : (
                    <button
                      className="bg-gradient-to-r from-emerald-700/80 via-cyan-700/80 to-emerald-700/80 hover:from-emerald-600/90 hover:via-cyan-600/90 hover:to-emerald-600/90 border-2 border-emerald-500/50 hover:border-emerald-400/70 text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm font-medium"
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

          <div className="py-6 px-8 bg-white/10 backdrop-blur-xl border border-white/20 mt-4 rounded-2xl shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="md:w-6/12 space-y-2">
                <label className="block text-white font-semibold">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  placeholder="Type your First Name"
                />
              </div>
              <div className="md:w-6/12 space-y-2">
                <label className="block text-white font-semibold">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  placeholder="Type your Last Name"
                />
              </div>
              <div className="mt-0 md:mt-7 hidden md:block md:w-[300px]">
                {nameSaveRequest ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-300 border-t-white"></div>
                    <span className="text-purple-200 text-sm">Saving...</span>
                  </div>
                ) : (
                  <button
                    className="bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-xs tracking-widest py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm w-full uppercase"
                    onClick={async () => {
                      await handleSaveShippingAddressReceiverName();
                    }}
                  >
                    CLICK TO UPDATE NAME
                  </button>
                )}
              </div>
            </div>

            <div className="py-3 md:hidden">
              {nameSaveRequest ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-300 border-t-white"></div>
                  <span className="text-purple-200 text-sm">Saving...</span>
                </div>
              ) : (
                <button
                  className="bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm w-full uppercase"
                  onClick={async () => {
                    await handleSaveShippingAddressReceiverName();
                  }}
                >
                  → UPDATE NAME
                </button>
              )}
            </div>
            {/* <button className="hover:scale-105 duration-300 bg-black text-white h-fit p-2 rounded-md w-full font-semibold">
          Click to update name
        </button> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
