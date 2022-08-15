import { animated, useTransition } from 'react-spring';
interface ReviewSection {
  isDisplayingSection: boolean;
  sectionTitle: string;
  variant?: ReviewSectionVariant;
  onClick?: () => void;
}

export enum ReviewSectionVariant {
  EDITABLE = 'editable',
  NOT_EDITABLE = 'not_editable'
}

const ReviewSection: React.FC<ReviewSection> = ({
  isDisplayingSection,
  sectionTitle,
  variant,
  onClick,
  children
}) => {
  const headerTransition = useTransition(isDisplayingSection, {
    from: { opacity: 1, fontSize: '20px', color: '#ffffff', y: 40 },
    enter: { opacity: 1, fontSize: '14px', color: '#90949E', y: 0 },
    config: { duration: 200 },
    exitBeforeEnter: true
  });

  const sectionTransition = useTransition(isDisplayingSection, {
    from: { y: 40 },
    enter: { y: 0 },
    exitBeforeEnter: true,
    delay: 400
  });

  return (
    <>
      {sectionTransition((styles, item) =>
        item ? (
          <animated.div
            className={`group flex w-full justify-between py-4 sm:px-5 rounded-lg ${
              variant !== ReviewSectionVariant.NOT_EDITABLE
                ? 'hover:bg-gray-syn8 hover:cursor-pointer'
                : ''
            } `}
          >
            <animated.div className={'w-full'} style={styles}>
              <>
                {headerTransition((styles, item) =>
                  item ? (
                    <animated.p
                      style={styles}
                      className="text-sm text-gray-syn4"
                    >
                      {sectionTitle}
                    </animated.p>
                  ) : null
                )}
                {children}
              </>
            </animated.div>
            {variant !== ReviewSectionVariant.NOT_EDITABLE ? (
              <animated.div
                className="items-center ml-2 flex opacity-0 cursor-pointer group-hover:opacity-100 group-hover:text-blue-navy "
                onClick={onClick}
              >
                {'Edit'}
              </animated.div>
            ) : null}
          </animated.div>
        ) : null
      )}
    </>
  );
};

export default ReviewSection;
