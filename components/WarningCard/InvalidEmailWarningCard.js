import Image from "next/image";
import images from "../../util/images";

function InvalidEmailWarningCard({ isRed, replaceText, width, height, fontSize, padding, margin, maxWidth,children }) {
    return <div style={{ display: "flex", margin: margin, padding: padding, borderRadius: "6.5px", width: "100%", maxWidth: maxWidth || "700px", alignItems: "center", gap: "10px", backgroundColor: isRed ? "#FF6969" : "#F4AE00" }}>
        <Image src={images.warning} width={width} height={height} alt="warning" />
        {
            children
        }
    </div>
}
export default InvalidEmailWarningCard; 