import Script from "next/script";

const TawkTo = () => {
    console.log("Loading tawk.");
    return <>
      <Script
        id="show-chat-widget"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/64995b1794cf5d49dc5fddbd/1h3rgnl4r';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `
        }}
      />
  </>
};
export default TawkTo;  