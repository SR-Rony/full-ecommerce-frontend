import { getFaqs } from '@/util/instance';
import { useEffect, useState } from 'react';
import Accordion from './accordions';
// import Accordion from './accordion';
import styles from './styles.module.css';


const FaqBase = () => {
  const [faqs, setFaqs] = useState({});
  const fetchFaqs = async () => {
    try {
      const res = await getFaqs();
      setFaqs(res?.data);
    } catch (error) {
      setFaqs({});
    }
  };

  useEffect(() => {
    fetchFaqs();
  },[]);

  return (
    <>
      <section className={styles.faq_section}>

        <div className="container mx-auto">
          <div className={styles.faq_wrapper_boxs} >
            <Accordion data={faqs?.data ||[]}/>
          </div>
        </div>
      </section>
    </>
  )
}

export default FaqBase