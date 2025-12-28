import loadingLogo from "@/public/loading.gif";
import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image src={loadingLogo} width={250} height={250} alt="loading" className="animate-pulse" />
        <div className="text-purple-200 font-mono font-semibold text-lg animate-pulse tracking-wider uppercase">Loading...</div>
      </div>
    </div>
  );
};

export default loading;
