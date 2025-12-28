"use client"
import { useEffect } from 'react';
import { MatomoProvider, createInstance, useMatomo } from '@datapunt/matomo-tracker-react';
import { matomoConfig } from '../matomo.config';
import { usePathname, useSearchParams } from 'next/navigation';

const Matomo = ({children}:{children:any}) => {
  const instance = createInstance(matomoConfig);

  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  useEffect(() => {
    const handleRouteChange = (url:any) => {
        //instance.trackPageView({ documentTitle: document.title, href: url });
        instance.trackPageView();
    };
    const url = `${pathname}?${searchParams}`
    console.log("URL",url)
    handleRouteChange(url);
  }, [pathname, searchParams])

//   useEffect(() => {
//     instance.trackPageView();
//     console.log("Matomo is tracking...")
//   }, []);

  return children;
};

export default Matomo;