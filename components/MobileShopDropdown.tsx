import { Dropdown } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MobileShopDropdown = ({ allCategories }: { allCategories: any[] }) => {
  const [mobileShowCycleDropdown, setMobileShowCycleDropdown] = useState(false); // State for cycle dropdown
  const router = useRouter();
  const cycleDropdownRef = useRef<HTMLDivElement>(null); // Ref for cycle dropdown

  // Handle category click logic
  const handleCategoryClick = (category: any) => {
    if (
      category?.slug === "lab-test-results" ||
      category?.slug === "lab-test-result" ||
      category?.slug === "lab-test-products" ||
      category?.slug === "lab-test-product"
    ) {
      router.push(`/products/lab-tested`);
    } else if (category?.slug === "cyclestrt-and-bundle-packs") {
      setMobileShowCycleDropdown((prev) => !prev); // Toggle cycle sub-menu
    } else {
      router.push(`/products/category/${category.slug}?name=${encodeURIComponent(category.name)}`);
    }
  };

  // Handle click outside to close cycle dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (cycleDropdownRef.current && !cycleDropdownRef.current.contains(e.target as Node)) {
      setMobileShowCycleDropdown(false);
    }
  };

  // Attach and clean up the event listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Dropdown label="SHOP" inline={true}>
      <ul className="divide-y-2 min-w-[150px]">
        <Dropdown.Item className="flex px-2 py-1 items-center justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group">
          <Link
            className="w-full h-full text-left"
            href={`/products/category/all?name=${encodeURIComponent("All Products")}`}
          >
            ALL PRODUCTS
          </Link>
          <span className="duration-300 invisible pe-6 group-hover:pe-1 group-hover:visible">{">"}</span>
        </Dropdown.Item>

        {Array.isArray(allCategories) &&
          allCategories.length > 0 &&
          allCategories.filter((item:any) => item?.slug !=="cyclestrt-and-bundle-packs").map((category: any, i) => (
            <div key={i}>
              <Dropdown.Item
                className="flex px-2 py-1 items-center justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group"
                onClick={(e) => e.stopPropagation()} // Prevent closing the main dropdown
              >
                <button
                  className="w-full h-full text-left"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the main dropdown
                    handleCategoryClick(category); // Handle category click
                  }}
                >
                  {category.name?.toUpperCase()}
                </button>
                <span className="duration-300 invisible pe-6 group-hover:pe-1 group-hover:visible">{">"}</span>
              </Dropdown.Item>

              {/* Sub-menu for cycle-related items */}
              {category.name.toLowerCase().startsWith("cycle") && mobileShowCycleDropdown && (
                <div className="ps-6" ref={cycleDropdownRef}>
                  {[
                    "Trt Packages",
                    "Mass & Off-Season Cycles",
                    "Cutting & Prep Cycles",
                    "Strength Cycles",
                    "Lean Muscle Mass Cycles",
                    "Post Cycle Therapy & Sexual",
                  ].map((e) => (
                    <Dropdown.Item
                      className="flex px-2 py-1 items-center justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group"
                      key={e}
                      onClick={() => {
                        router.push(`/products/cycle?id=${encodeURIComponent(e)}`);
                      }}
                    >
                      <button>{e.toUpperCase()}</button>
                      <span className="duration-300 invisible pe-6 group-hover:pe-1 group-hover:visible">{">"}</span>
                    </Dropdown.Item>
                  ))}
                </div>
              )}
            </div>
          ))}

           <Dropdown.Item className="flex px-2 py-1 items-center justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group">
                      <Link
                        className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 text-transparent bg-clip-text"
                        href={`/products/neobio`}
                      >
                        NEW PEPTIDE BRAND
                      </Link>
                      <span className="duration-300 invisible  pe-6  group-hover:pe-1  group-hover:visible    ">
                        {">"}
                      </span>
                    </Dropdown.Item>{" "}
      </ul>
    </Dropdown>
  );
};

export default MobileShopDropdown;
