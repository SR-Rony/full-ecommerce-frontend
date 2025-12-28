import PdfViewerModal from "@/components/Modals/PdfViewerModal";
import rightArrow from "@/public/arrow-right-icon-pd.906832f1.svg";
import { isValidArray } from "@/util/func";
import { getLabTestedProducts, trackLabTestedProducts } from "@/util/instance";
import localFont from "next/font/local";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Loader from "./Loader/Loader";
import Paginate from "./Paginate/Paginate";
import { CiSearch } from "react-icons/ci";
import debounce from "lodash/debounce";

const myfont = localFont({
  src: "../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const LabTestedProducts = () => {
  const [isRequestProduct, setIsRequestProduct] = useState(true);
  const [products, setProducts] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [initPaginate, setInitPaginate] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePdfOpen = (url: any) => {
    setPdfFile(url);
    setPdfOpen(true);
  };

  const fetchLabTestedProducts = async (val = {}) => {
    try {
      setIsRequestProduct(true);
      const res = await getLabTestedProducts(val);
      if (res?.data?.success) {
        setProducts(res?.data);
      }
      setIsRequestProduct(false);
    } catch (error) {
      setIsRequestProduct(false);
      console.log(error, "error");
    }
  };

  // Create debounced function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchLabTestedProducts({ page: 1, limit: 20, q: query });
      setCurrentPage(1);
    }, 500),
    []
  );

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    fetchLabTestedProducts({ page: currentPage, limit: 20, q: "" });
  }, [currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleLabTestedProductTrackClicked = async (data = {}) => {
    try {
      const res = await trackLabTestedProducts(data);
    } catch (error) { }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`${myfont.className} text-4xl md:text-6xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6`}>
            Lab Tested Products
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search lab tests..."
                className="w-full px-6 py-4 pe-14 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-800/80 to-slate-700/80 hover:from-purple-700/90 hover:to-slate-600/90 text-white p-2 rounded-lg transition-all duration-300"
              >
                {isRequestProduct ? (
                  <div className="animate-spin w-6 h-6 border-2 border-purple-300 border-t-white rounded-full"></div>
                ) : (
                  <CiSearch className="w-6 h-6" onClick={() => debouncedSearch(searchQuery)} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="min-h-[400px]">
          {isRequestProduct && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-300 shadow-lg"></div>
                <p className="text-purple-200 font-mono font-semibold text-lg animate-pulse tracking-wider uppercase">Loading Lab Tests...</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto gap-6">
            {!isRequestProduct &&
              isValidArray(products?.data) &&
              products.data.map((item: any, i: number) => (
                <ProductCard
                  key={i}
                  data={item}
                  handleTrackClick={handleLabTestedProductTrackClicked}
                  handlePdfOpen={handlePdfOpen}
                />
              ))}
          </div>

          {!isRequestProduct && !isValidArray(products?.data) && (
            <div className="text-center py-20">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-white mb-4">
                  No Results Found
                </h1>
                <p className="text-gray-300">
                  We&apos;re sorry. We cannot find any matches for your search term.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-12">
            {!isRequestProduct && (
              <Paginate
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={products?.paginate?.totalPage || 0}
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>
      {pdfOpen && pdfFile && (
        <PdfViewerModal 
          isOpen={pdfOpen} 
          setIsOpen={setPdfOpen} 
          url={pdfFile}
          overwriteText="Lab Test Report"
        />
      )}
    </div>
  );
};

const ProductCard = ({ data, handleTrackClick, handlePdfOpen }: any) => (
  <div
    className="group relative bg-cover bg-center rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-300 border-2 border-white/20 hover:border-emerald-400/50"
    style={{
      backgroundImage: `url(${data?.bgImage || "/thumbnail_tested.png"})`,
    }}
  >
    {/* Background Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/60 to-black/70 backdrop-blur-[1px]"></div>

    {/* Content */}
    <div className="relative p-6 text-center text-white flex flex-col gap-4">
      <h2 className="text-2xl md:text-3xl font-extrabold min-h-[72px] bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
        {data?.title}
      </h2>

      {/* Product Info */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg">
        <p className="text-sm tracking-wider mb-2">
          <span className="text-gray-300">ADVERTISED AT:</span> <span className="font-bold text-white">{data?.advertisedAt}</span>
        </p>
        <p className="text-sm tracking-wider">
          <span className="text-gray-300">TESTED AT:</span> <span className="font-bold text-emerald-400">
            {data?.title?.toUpperCase()?.includes("AUCTROPIN 120IU") ? (
              <>6.32 MG/VIAL (17.22IU) & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 font-bold drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">99% PURITY</span></>
            ) : data?.testedAt}
          </span>
        </p>
      </div>

      {/* Lab Report Button */}
      <button
        className="bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 w-full text-purple-100 py-3 rounded-xl font-mono text-sm tracking-widest transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm"
        onClick={() => {
          handleTrackClick({
            labTestedId: data?._id,
            isClicked: true,
          });
          handlePdfOpen(data?.reportLink);
        }}
      >
        → VIEW LAB REPORT
      </button>

      {/* Product Page Button */}
      <button
        className="bg-white/10 border-2 border-white/20 hover:bg-white/20 hover:border-cyan-400/50 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-mono text-sm tracking-widest uppercase backdrop-blur-sm"
        onClick={() => {
          const url = isValidArray(data?.products)
            ? data?.products.length === 1
              ? `/products/details/${data?.products[0]?.slug}`
              : `/products/all?products=${data.products
                .map((item: any) => item._id)
                .toString()}`
            : "";
          if (url) {
            window.open(url, "_blank");
          }
        }}
      >
        GO TO PRODUCT
        <Image width={16} height={16} alt="arrow" src={rightArrow} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);


export default LabTestedProducts;
