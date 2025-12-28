'use client'

import { MyContexts } from "@/components/stage/Providers";

import { useContext } from "react";
export const useFullStage = () => {
    return useContext(MyContexts)
}
