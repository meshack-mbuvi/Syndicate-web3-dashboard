import { SkeletonLoader } from '@/components/skeletonLoader';
import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { NFTMediaType } from '../nftPreviewer';

interface Props {
  heightClass: string;
  widthClass: string;
  numberOfParticles?: number;
  floatingIcon?: string;
  isArtwork?: boolean;
  mediaType?: NFTMediaType;
  isLoadingFloatingIcon?: boolean;
  customId?: string;
}

// eslint-disable-next-line react/display-name
export const CollectivesInteractiveBackground: React.FC<Props> = React.memo(
  ({
    heightClass = 'w-full',
    widthClass = 'h-full',
    numberOfParticles = 40,
    floatingIcon,
    isArtwork,
    mediaType = NFTMediaType.IMAGE,
    isLoadingFloatingIcon,
    customId = ''
  }) => {
    const particlesInit = async (main: any) => {
      await loadFull(main);
    };

    return (
      <div
        className={`relative ${heightClass} ${widthClass} overflow-hidden select-none`}
      >
        {/* tsParticles: Copyright 2020 Matteo Bruni, released under MIT License | https://github.com/matteobruni/tsparticles/blob/main/LICENSE */}
        <Particles
          id={
            customId
              ? customId
              : isArtwork
              ? 'particles-js-duplicate'
              : 'particles-js'
          }
          init={particlesInit}
          canvasClassName="particles-container relative"
          params={{
            particles: {
              number: {
                value: numberOfParticles,
                density: {
                  enable: true,
                  value_area: 631.3181133058181
                }
              },
              color: {
                value: isArtwork ? '#ffffff' : '#000000'
              },
              shape: {
                type: 'edge',
                stroke: {
                  width: 1,
                  color: isArtwork ? '#ffffff' : '#90949E'
                },
                polygon: {
                  nb_sides: 3
                },
                image: {
                  src: 'img/github.svg',
                  width: 100,
                  height: 100
                }
              },
              opacity: {
                value: 0.49716301422833176,
                random: true,
                anim: {
                  enable: false,
                  speed: 1,
                  opacity_min: 0.1,
                  sync: false
                }
              },
              size: {
                value: 5.7,
                random: true,
                anim: {
                  enable: false,
                  speed: 40,
                  size_min: 0.1,
                  sync: false
                }
              },
              line_linked: {
                enable: true,
                distance: 160.3412060865523,
                color: '#ffffff',
                opacity: isArtwork ? 1 : 0.4008530152163807,
                width: 1
              },
              move: {
                enable: true,
                speed: 2.2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'bounce',
                bounce: false,
                attract: {
                  enable: isArtwork ? false : true,
                  rotateX: isArtwork ? 1763.753266952075 : 17630.753266952075,
                  rotateY: isArtwork ? 1603.4120608655228 : 16030.4120608655228
                }
              }
            },
            interactivity: isArtwork
              ? {}
              : {
                  detect_on: 'canvas',
                  events: {
                    onhover: {
                      enable: true,
                      mode: 'grab'
                    },
                    onclick: {
                      enable: true,
                      mode: 'push'
                    },
                    resize: true
                  },
                  modes: {
                    grab: {
                      distance: 400,
                      line_linked: {
                        opacity: 0.156297557645007
                      }
                    },
                    bubble: {
                      distance: 400,
                      size: 40,
                      duration: 2,
                      opacity: 0.09744926547616141
                    },
                    repulse: {
                      distance: 200,
                      duration: 0.4
                    },
                    push: {
                      particles_nb: 4
                    },
                    remove: {
                      particles_nb: 2
                    }
                  }
                },
            retina_detect: true,
            fullScreen: false
          }}
        />
        {floatingIcon && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
            <div className="p-2 border border-gray-syn4 animate-float">
              <div className="w-full h-full bg-gray-syn9">
                {isLoadingFloatingIcon && (
                  <SkeletonLoader
                    width="20"
                    height="20"
                    borderRadius="rounded-none"
                    margin="my-0"
                  />
                )}
                {(mediaType === NFTMediaType.IMAGE ||
                  mediaType === NFTMediaType.CUSTOM) &&
                  !isLoadingFloatingIcon && (
                    <img
                      src={floatingIcon}
                      alt="Collective icon"
                      className="w-20 h-20 bg-gray-syn7 select-none"
                    />
                  )}
                {mediaType === NFTMediaType.VIDEO && !isLoadingFloatingIcon && (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    autoPlay
                    playsInline={true}
                    loop
                    muted
                    className={`${'object-cover'} w-20 h-20`}
                  >
                    <source src={floatingIcon} type="video/mp4"></source>
                  </video>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
