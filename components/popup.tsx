/* eslint-disable @next/next/no-img-element */
"use client";
import { useFullStage } from "@/hooks/useFullStage";

import { Dancing_Script } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const DancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
});
const Popup = () => {
  const router = useRouter();
  const { Auth, Settings }: any = useFullStage();
  const [popup, setPopup] = Settings.Popup;
  const [popupVisible,setPopupVisible] = Settings.PopupVisible;
  const [pop, setpop] = useState(false);
  const timeout = useRef<any>(null)
  const showEverySeconds = 60*10; // every 10min.
  const pathname  = usePathname();

  function check() {
    const path = window.location.pathname;
    if(!path) {
      clearTimeout(timeout.current);
      return;
    }
    
    if(path!="/" && !path.startsWith("/products/details/")) {
      clearTimeout(timeout.current);
      return;
    }
    const visited_at = localStorage.getItem("visited_at");
    if(!visited_at) {
      setpop(true);
      localStorage.setItem("visited_at",new Date().toISOString());
      setTimeout(check,2000);
    } else if( (new Date().getTime() - new Date(visited_at).getTime())/1000 >= showEverySeconds ) {
      setpop(true);
      localStorage.setItem("visited_at",new Date().toISOString());
      setTimeout(check,2000);
    } else {
      const passed = (new Date().getTime() - new Date(visited_at).getTime())/1000;
      let remaining = showEverySeconds - passed;
      if(remaining<=0) {
        remaining = 0;
      }
      clearTimeout(timeout.current);
      timeout.current = setTimeout(()=>{
        setpop(true);
        localStorage.setItem("visited_at",new Date().toISOString());
        setTimeout(check,2000);
      },remaining*1000)
    }
  }

  useEffect(()=>{
    setPopupVisible(pop);
  },[pop,setPopupVisible])

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handlePopClose = (reshow=false) => {
    setpop(false);
    localStorage.setItem("visited", "false");
    localStorage.setItem("visited_at", new Date().toISOString());
    localStorage.setItem("home_popup_closed_at", new Date().toISOString());
    check();
    if(!reshow) {
    }
  };

  const handleRedirect = (link: any) => {
    router.push(link);
  };

  return (
    pop && (
      <div className="">
        {popup?.isHideTitleDescription ? (
          <div
            className="overflow-hidden"
            onClick={(e)=>{
              if((e.target as any).alt!="promo") {
                handlePopClose(true)
              }
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99999,
            }}
          >
            <div
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "5px",
                position: "relative",
                width: "1280px",
                height: "750px",
                maxWidth: "90vw",
              }}
              className="md:max-h-[90vh] max-h-[70vh]"
            >
              <button
                style={{
                  position: "absolute",
                  top: "-25px",
                  right: "0px",

                  color: "rgb(255, 255, 255)",
                  fontSize: "20px",
                  backgroundColor: "transparent", // You can add a background color if needed
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handlePopClose()}
              >
                X
              </button>

              <img
                style={{
                  width: "1280px",
                  height:"100%",
                  maxWidth: "90vw",
                }}
                onClick={() => {
                  if (popup?.image?.redirectUrl) {
                    handleRedirect(popup?.image?.redirectUrl);
                  }
                }}
                className="absolute"
                alt="promo"
                loading="lazy"
                src={popup?.image?.imgUrl}
                decoding="async"
              />
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                position: "fixed",
                top: 10,
                padding: "10px",
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",

                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99999,
              }}
            >
              <div
                style={{
                  backgroundColor: "rgb(255, 255, 255)",
                  position: "relative",
                  borderRadius: "10px",
                }}
              >
                <button
                  style={{
                    position: "absolute",
                    top: "30px",
                    right: "20px",
                    borderRadius: "100%",
                    color: "black",
                    fontSize: "20px",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePopClose()}
                >
                  X
                </button>
                <div className="w-full h-[50%] ">
                  <img
                    src={popup?.image?.imgUrl}
                    style={{
                      width: "1280px",
                      height: "530px",
                      maxWidth: "90vw",
                      maxHeight: "90vh",
                    }}
                    className="w-full h-full rounded-t"
                    alt=""
                  />
                </div>

                <div
                  className={`w-full h-[50%] rounded-b`}
                  style={{
                    background: popup?.backgroundColorOfTitleDescriptionButton,
                  }}
                >
                  <div className="h-full" style={{ padding: "20px" }}>
                    <h2
                      className="font-bold text-[40px] capitalize text-center"
                      style={{ color: popup?.titleTextColor }}
                    >
                      {" "}
                      {popup.title}
                    </h2>
                    <p
                      className="text-center"
                      style={{ color: popup.descriptionTextColor }}
                    >
                      {" "}
                      {popup.description}
                    </p>
                    {popup?.button?.checked && (
                      <button
                        className="rounded-md py-2 px-4 mt-2 mx-auto block"
                        style={{
                          background: popup?.button?.backgroundColor,
                          color: popup?.button?.textColor,
                        }}
                        onClick={() => {
                          if (popup?.button?.redirectUrl) {
                            router.push(popup?.button?.redirectUrl);
                          }
                        }}
                      >
                        {popup?.button?.text}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
};

export default Popup;
