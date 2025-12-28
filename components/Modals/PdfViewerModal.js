/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from '@headlessui/react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import React, { useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';

const PdfViewerModal = ({ isOpen, setIsOpen, url, overwriteText }) => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog
                as="div"

                className="fixed inset-0 z-[1000] overflow-y-auto"

                onClose={() => {
                    console.log("on close");
                    setIsOpen(false)
                }}
            >
                {/* <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child> */}

                <div className="flex items-center justify-center min-h-screen">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-[70rem] overflow-hidden text-left align-middle transition-all transform bg-white mb-5 shadow-md rounded-2xl border ">
                            <div className="flex justify-between items-center mb-4 bg-black p-3">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                                    LAB REPORT
                                </Dialog.Title>
                                <button
                                    className="text-gray-200 hover:text-gray-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <IoMdCloseCircle size={22} />
                                </button>
                            </div>
                            <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                                {/* Animated Gradient Background */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white via-white to-white animate-gradientMove"></div>

                                {url ? (
                                    <img className="w-full h-auto relative z-10" src={url} alt="report" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 text-black text-3xl font-bold">
                                        {overwriteText || <div className="animate-fadeIn tracking-wide text-center">
                                            <span className="animate-glow">Coming Soon</span>
                                        </div>}
                                    </div>
                                )}
                            </div>

                            <style>
                                {`
  @keyframes fadeIn {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes glow {
    0% { text-shadow: 0 0 5px rgba(255,255,255,0.5); }
    100% { text-shadow: 0 0 20px rgba(255,255,255,1); }
  }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-fadeIn {
    animation: fadeIn 1.5s ease-in-out;
  }

  .animate-glow {
    animation: glow 1.5s ease-in-out infinite alternate;
  }

  .animate-gradientMove {
    background-size: 300% 300%;
    animation: gradientMove 5s ease infinite;
  }
`}
                            </style>
                            {/* <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                    <Viewer
                                        fileUrl={url}
                                        plugins={[defaultLayoutPluginInstance]}
                                        defaultScale={zoomLevel}
                                    />
                                </Worker> */}

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default PdfViewerModal;
