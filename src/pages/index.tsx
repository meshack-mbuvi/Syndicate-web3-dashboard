import { Link } from "gatsby";
import React from "react";
<<<<<<< HEAD:src/pages/index.tsx
import SEO from "src/components/seo";
import Footer from "src/components/navigation/footer";
import Link from "next/link";
=======
import Footer from "src/components/navigation/footer";
import SEO from "src/components/seo";
import brand from "src/images/brand.svg";
>>>>>>> Show totalDeposits, distributions, totalLpdeposits and lpWithdrawals on my syndicates screen.:src/pages/index.js

function IndexPage() {
  return (
    <>
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <div className="full-height pt-6 pb-16 sm:pb-24">
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5 pt-4 flex items-center justify-between">
              <div className="-mr-2">
                <button
                  type="button"
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <p className="text-8xl tracking-tight font-extrabold text-white sm:text-5xl md:text-8xl leading-10 mb-8">
              Join the Revolution.
            </p>
            <p className="text-white text-3xl">
              Crypto investing protocol and social network
            </p>

            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
<<<<<<< HEAD:src/pages/index.tsx
              <div className="rounded-md mt-5">
                <Link href="/feed">
                  <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white hover md:py-4 md:text-lg md:px-10 bg-blue-light">
                    Use Syndicate
                  </a>
=======
              <div className="rounded-md mt-5" to="/dashboarb">
                <Link
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white hover md:py-4 md:text-lg md:px-10 bg-blue-light"
                  to="/syndicates">
                  Use Syndicate
>>>>>>> Show totalDeposits, distributions, totalLpdeposits and lpWithdrawals on my syndicates screen.:src/pages/index.js
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* footer */}
      <div className="flex absolute w-full bottom-4">
        <Footer />
<<<<<<< HEAD:src/pages/index.tsx
        <img src="/images/brand.svg" className="bottom-logo" />
=======
        <img src={brand} className="absolute bottom-4 right-10 w-16" />
>>>>>>> Show totalDeposits, distributions, totalLpdeposits and lpWithdrawals on my syndicates screen.:src/pages/index.js
      </div>
    </>
  );
}

export default IndexPage;
