
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
export default function CloseLiveChat({ isOpen, setIsOpen,setPopupOpen,popupOpen }) {


    const closeModal = () => {
        setIsOpen(false);
    };

    const handleLeave = ()=>{
        window.localStorage.removeItem('rtcChatId')
        setIsOpen(false);
        setPopupOpen(!popupOpen)
    }
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => { }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto ">
                        <div className="flex min-h-full items-center justify-end p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden  bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-full">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl w-md text-center font-bold leading-6 text-gray-900 capitalize"
                                        >
                                            Are you sure?
                                        </Dialog.Title>

                                    </div>



                                    <div className="mt-4">
                                        <p> You want to close this chat</p>

                                    </div>
                                    <div className="mt-4 flex gap-4 justify-end">
                                        <button className="bg-black text-white rounded-md px-4 py-2"onClick={()=>{
                                            handleLeave()
                                        }}>Leave</button>
                                        <button className="bg-gray-200 text-black rounded-md px-4 py-2" onClick={() => {
                                            setIsOpen(false)
                                        }}>Cancel</button>

                                    </div>


                                </Dialog.Panel>


                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
