import Image from "next/image";
import images from "../../util/images";
import styles from "./styles.module.css";

function WarningCard({isRed,replaceText,width,height,fontSize,padding,margin,maxWidth}) {
    return <div style={{display:"flex",margin:margin,padding:padding,borderRadius:"6.5px",width:"100%",maxWidth:maxWidth || "700px",alignItems:"center",gap:"10px",backgroundColor: isRed? "#FF6969":"#F4AE00"}}>
        <Image src={images.warning} width={width} height={height} alt="warning" />
        <p className={styles.p} style={{fontSize:fontSize,fontWeight:"500"}}>{ replaceText || <><b>NOTE:</b> YOUR ORDER <b>MAY NOT CONFIRM FOR UP TO 6 HOURS.</b> BTC BLOCKCHAIN MUST CONFIRM TRANSACTION, THIS IS TOTALLY NORMAL. <b>ONLY CONTACT SUPPORT IF THE ORDER ISN&apos;T CONFIRMED AFTER 6 HOURS AT THE LATEST!</b></>}</p>
    </div>
}
export default WarningCard; 