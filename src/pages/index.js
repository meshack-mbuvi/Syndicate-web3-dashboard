import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
// import Button from "../components/button";
import Footer from "../components/footer";
import { Link } from "gatsby";
import logo from "../images/logo.inline.svg";

function IndexPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
            <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt=""
                  />
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Close menu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <p className="join-the-revolution">Join the Revolution.</p>
              </h1>
              <p className="sub-heading">
                Crypto investing protocol and social network
              </p>

              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md mt-5" to="/dashboarb">
                  <Link
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white hover md:py-4 md:text-lg md:px-10 bg-light-green"
                    to="/app"
                  >
                    Launch App
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* footer */}
      <Footer />
      <img src={logo} className="bottom-logo" />
    </Layout>
  );
}

export default IndexPage;
