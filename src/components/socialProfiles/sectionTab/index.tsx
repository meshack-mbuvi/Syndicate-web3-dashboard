const SectionTab = (props: {
    title,
    assignedRef,
    children?
}) => {
    const {
      assignedRef, 
      children
    } = props;

    return <div ref={assignedRef}>{children}</div>
  };
  
export default SectionTab;
