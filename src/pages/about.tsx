import React from 'react';
import Head from 'src/components/syndicates/shared/HeaderTitle';
import Layout from 'src/components/layout';
import SEO from 'src/components/seo';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <Head title="About" />
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="About"
      />

      <section className="flex flex-col items-center md:flex-row">
        <div className="md:w-2/3 md:mr-8">
          <blockquote className="pl-4 font-serif leading-loose text-justify border-l-4 border-gray-900">
            The point is... to live one&apos;s life in the full complexity of
            what one is, which is something much darker, more contradictory,
            more of a maelstrom of impulses and passions, of cruelty, ecstacy,
            and madness, than is apparent to the civilized being who glides on
            the surface and fits smoothly into the world.
          </blockquote>

          <cite className="block mt-4 text-xs font-bold text-right uppercase">
            – Thomas Nagel
          </cite>
        </div>

        <figure className="w-2/3 md:w-1/3"></figure>
      </section>
    </Layout>
  );
};

export default AboutPage;
