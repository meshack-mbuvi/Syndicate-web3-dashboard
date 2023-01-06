import React, { Children } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/** The in-built Next/link component does not automatically
 * detect the current active link for us to style our nav links
 * accordingly.
 *
 * This component solves this problem.
 */

/** Documentation on prop types for this component */
interface ActiveLinkProps {
  // The route to point link to
  href: string;
  // an optional styling prop
  customActive?: string;
  children: React.ReactElement<{ className?: string }>;
}

const ActiveLink = (props: ActiveLinkProps) => {
  const { href, customActive, children } = props;
  const { pathname } = useRouter();

  const childElements = Children.map(children, (child) => {
    // add active link class if the current link is active.
    if (pathname === href) {
      // We are passing a custom styling for navbar links to override blue styling for active links
      const className = `${child.props.className ?? ''} ${
        customActive ? customActive : 'active'
      }`.trim();

      console.log(className);

      return React.cloneElement(child, { className });
    }

    return child;
  });

  return (
    <Link href={href} passHref>
      <>{childElements}</>
    </Link>
  );
};

export default ActiveLink;
