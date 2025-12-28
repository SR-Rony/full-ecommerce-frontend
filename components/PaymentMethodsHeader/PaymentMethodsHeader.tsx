"use client";

import { useFullStage } from "@/hooks/useFullStage";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./style.module.css";

export default function PaymentMethodsHeader() {
  const { Auth, Settings }: any = useFullStage();
  const [setting, setSetting] = Settings?.Setting || [];
  const appInfo = setting?.appInfo || {};
  const pathname = usePathname();
  if (!appInfo?.headerBanner) return null;
  return pathname == "/" ? (
    <div className={styles.bitcoin_container}>
      <div
        className={styles.bitcoin_title}
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <Image
          src={appInfo?.headerBanner?.iconImage}
          width={50}
          height={50}
          alt="Bitcoin"
        />
        <div>
          <h1 className={styles.bitcoin_header}>
            {appInfo?.headerBanner?.title || ""}
          </h1>
          <div className={styles.hide_mobile}>
            {" "}
            <Payments appInfo={appInfo} />{" "}
          </div>
        </div>
        <Image
          src={appInfo?.headerBanner?.iconImage || ""}
          width={50}
          height={50}
          alt=""
        />
      </div>
      <div className={styles.hide_desktop}>
        {" "}
        <Payments appInfo={appInfo} />{" "}
      </div>
    </div>
  ) : (
    <div style={{ marginTop: "0px" }}></div>
  );
}

function Payments({ appInfo }: any) {
  return (
    <div
      className={styles.mobile_column}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/** cashapp */}
      <div className={styles.mobile_row}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <p className={styles.payment_text}>
            {appInfo?.headerBanner?.app1?.text}
          </p>
          <Image
            className={styles.payment_ico}
            src={appInfo?.headerBanner?.app1?.image}
            width={107}
            height={23}
            alt=""
          />
        </div>
        <Image
          onClick={(e) => {
            window.open(
              appInfo?.headerBanner?.app1?.redirectUrl || "#",
              "_blank"
            );
          }}
          className={styles.click_here}
          style={{ cursor: "pointer", display: "block", margin: "auto" }}
          src={appInfo?.headerBanner?.app1?.ctaImage}
          width={190}
          height={58}
          alt="click here"
        />
      </div>

      {/** coinbase */}
      <div className={styles.mobile_row}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <p className={styles.payment_text}>
            {appInfo?.headerBanner?.app2?.text || ""}
          </p>
          <Image
            className={styles.payment_ico}
            src={appInfo?.headerBanner?.app2?.image}
            width={107}
            height={23}
            alt=""
          />
        </div>
        <Image
          onClick={(e) => {
            window.open(
              appInfo?.headerBanner?.app2?.redirectUrl || "#",
              "_blank"
            );
          }}
          className={styles.click_here}
          style={{ cursor: "pointer", display: "block", margin: "auto" }}
          src={appInfo?.headerBanner?.app2?.ctaImage}
          width={190}
          height={58}
          alt="click here"
        />
      </div>

      {/** paypal */}
      <div className={styles.mobile_row}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <p className={styles.payment_text}>
            {appInfo?.headerBanner?.app3?.text || ""}
          </p>
          <Image
            className={styles.payment_ico}
            src={appInfo?.headerBanner?.app3?.image || ""}
            width={107}
            height={23}
            alt=""
          />
        </div>
        <Image
          onClick={(e) => {
            window.open(
              appInfo?.headerBanner?.app3?.redirectUrl || "",
              "_blank"
            );
          }}
          className={styles.click_here}
          style={{ cursor: "pointer", display: "block", margin: "auto" }}
          src={appInfo?.headerBanner?.app3?.ctaImage || ""}
          width={190}
          height={58}
          alt="click here"
        />
      </div>
    </div>
  );
}
