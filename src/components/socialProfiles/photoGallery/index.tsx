import Modal from "@/components/modal";
import React, { useState, useEffect } from "react";

function PhotoGallery(props: {
    photos: {URL: string, caption?: string}[],
    showCaptions?: boolean,
    customClassesForControls?: string,
    customClasses?: string
}) {
    const {
        photos, 
        showCaptions = true, 
        customClassesForControls, 
        customClasses
    } = props;

    const [isCaptionModalVisible, setCaptionModalVisibility] = useState(false)

    const [photoIndex, setPhotoIndex] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)
    const numberOfPhotos = photos.length

    const incrementPhotoIndex = () => {
        setPhotoIndex((photoIndex + 1) % numberOfPhotos)
    }

    const decrementPhotoIndex = () => {
        setPhotoIndex((photoIndex - 1 + numberOfPhotos) % numberOfPhotos)
    }

    // Carousel photo advance timing
    const transitionDelay = 6
    const pauseDelay = 12
    if (numberOfPhotos > 1) {
        var transitionTimer
        useEffect(() => {
            clearTimeout(transitionTimer);
            if (autoPlay) {
                (function(){
                    transitionTimer = setTimeout(incrementPhotoIndex, 1000*transitionDelay);
                })();
            }
            else {
                (function(){
                    transitionTimer = setTimeout(() => {setAutoPlay(true)}, 1000*pauseDelay);
                })();
            }
        });
    }

    // Navigation dot control to select photos
    const renderedDots = photos.map((photo, index) => {
        return(
            <button 
                className={`${photoIndex === index ? "bg-opacity-100" : "bg-opacity-30"} mr-3 h-2 w-2 bg-white rounded-full focus:outline-none`}
                onClick={() => {
                    setPhotoIndex(index)
                    setAutoPlay(false)
                    clearTimeout(transitionTimer);
                }}>
            </button>
        );
    });

    const isOnlyPhoto = numberOfPhotos === 1
    var anyPhotoHasCaption = false
    photos.forEach(photo => {if (photo.caption) {anyPhotoHasCaption = true}})

    const size = "w-full h-full";
    const bgImgPositioning = "bg-cover bg-no-repeat bg-center"
    const showControls = isOnlyPhoto ? "hidden" : "block"

    // Images
    const renderedImages = photos.map((photo, index) => {
        return(
            <div 
                className={`${bgImgPositioning} ${index === photoIndex ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full transition-all rounded-sm`}
                style={{backgroundImage : `url('${photo.URL}')`}}>
            </div>
        );
    });

    return (
        <React.Fragment>

            <Modal
                show={isCaptionModalVisible}
                closeModal={() => {setCaptionModalVisibility(false)}}
                loading={false}
                showCloseButton={true}
                type="normal"
            >
                <p className="mb-5">{photos[photoIndex].caption}</p>
            </Modal>

            <div className={`${size} ${customClasses} flex flex-col overflow-hidden ${numberOfPhotos > 1 ? "" : ""}`} style={{maxHeight: "100%"}}>

                {/* Image */}
                <div className={`perfect-square rounded-sm animate-fade_in bg-gray-9 overflow-hidden relative`}>
                    {renderedImages}
                </div>

                {/* Mobile gradient */}
                <div className="absolute w-full h-20 block sm:hidden" style={{marginTop: "240px", backgroundImage : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)'}}></div>

                {/* Caption */}
                <div className={`${isOnlyPhoto || !anyPhotoHasCaption || !showCaptions ? "hidden" : "block h-12 mt-6"}`}>
                    <p
                        onClick={() => {setCaptionModalVisibility(true)}}
                        className={`text-gray-500 mb-0 font-whyte-light text-sm line-clamp-2`}>
                        {photos[photoIndex].caption}
                    </p>
                </div>

                {/* Controls */}
                <div className={`${showControls} ${customClassesForControls} mt-6 relative`}>
                    <div className="flex items-center">
                        <button
                            className="mr-3 focus:outline-none"
                            onClick={() => {
                                decrementPhotoIndex()
                                setAutoPlay(false)
                                clearTimeout(transitionTimer);
                            }}>
                            <img src="/images/leftArrow.svg"/>
                        </button>
                        {renderedDots}
                        <button
                            className="mr-3 focus:outline-none"
                            onClick={() => {
                                incrementPhotoIndex()
                                setAutoPlay(false)
                                clearTimeout(transitionTimer);
                            }}>
                            <img src="/images/rightArrow.svg"/>
                        </button>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );

}

export default PhotoGallery;