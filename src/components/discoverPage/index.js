import React from "react";
import PropTypes from "prop-types";

import "./discover.css";

import PageHeader from "src/components/pageHeader";
import Card from "./card";

import { sectionCards } from "src/utils/sectionCards";
import { Divider } from "src/components/divider";
import AddButton from "src/components/buttons/addButton";

/**
 * Renders a section with title and other components
 * @param {*} props an object that contains:
 *    - title section title which should be a string
 *    - children An html element which in our case its going
 *      to be rectangular cards.
 * @return {*} React component
 */
const Section = ({ title, children }) => {
  return (
    <div className="flex flex-col mb-2">
      <p className="section-title">{title}</p>
      <div className="p-2 flex flex-row">{children}</div>
    </div>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Discover = () => {
  return (
    <div className="w-full">
      <PageHeader>Discover </PageHeader>
      <p className="discover-sub-header pt-2">
        Explore the latest syndicates looking to investing in top people,
        projects, and startups
      </p>

      {Object.keys(sectionCards).map((title, key_index) => (
        <div key={title} className="pb-2">
          {/* Render each section with associated cards */}
          <Section title={title} key={title}>
            {/* We render cards here */}
            {sectionCards[title].map((details, index) => (
              <Card
                content={details.text}
                subText={details.subText}
                customClass={details.customClass}
                key={index}
              />
            ))}
          </Section>

          {/* since we have 3 row, we prevent divider from
           showing after the last row */}
          {key_index !== 2 ? <Divider /> : ""}
        </div>
      ))}

      <div className="mb-4 round-btn-container">
        <AddButton>+</AddButton>
      </div>
    </div>
  );
};

export default Discover;
