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

  // children i.e. <a> tag that this component receives.
  children;
}

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const ActiveLink = (props: ActiveLinkProp) => {
  const { href, children } = props;
  const { pathname } = useRouter();

  let className = children.props.className || "";

  // add active link class if the current link is active.
  if (pathname === href) {
    className = `${className} active`.trim();
  }

  return <Link href={href}>{React.cloneElement(children, { className })}</Link>;
};

export default ActiveLink;
