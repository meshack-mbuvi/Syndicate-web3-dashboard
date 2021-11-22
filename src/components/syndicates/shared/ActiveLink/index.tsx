/** The in-built Next/link component does not automatically
 * detect the current active link for us to style our nav links
 * accordingly.
 *
 * This component solves this problem.
 */

/** Documentation on prop types for this component */
interface ActiveLinkProp {
  // The route to point link to
  href: string;
  // an optional styling prop
  customActive?: string;

  // children i.e. <a> tag that this component receives.
  children;
}

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const ActiveLink: React.FC<ActiveLinkProp> = (props) => {
  const { href, customActive, children } = props;
  const { pathname } = useRouter();

  let className = children.props.className || "";

  // add active link class if the current link is active.
  if (pathname === href) {
    // We are passing a custom styling for navbar links to override blue styling for active links
    className = `${className} ${customActive? customActive: "active"}`.trim();
  }

  return <Link href={href}>{React.cloneElement(children, { className })}</Link>;
};

export default ActiveLink;
