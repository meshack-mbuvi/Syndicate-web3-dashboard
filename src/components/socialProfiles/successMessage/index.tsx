const SuccessMessage = (props: {
    title: string, 
    subtitle?: string, 
    customClasses?: string
}) => {
    const {
        title, 
        subtitle, 
        customClasses
    } = props;

    return (
        <div className={`${customClasses}`}>
            <img 
                className="mx-auto mb-6"
                src={`/images/checkCircle.svg`}/>
            <h2 className="text-xl mb-2">{title}</h2>
            {subtitle ?
                <p className="text-center opacity-50">
                    {subtitle}
                </p> : null}
        </div>
    );
  };
  
  export default SuccessMessage;
  