import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
// import { NFTMediaType } from '@/components/collectives/nftPreviewer';

export enum NFTMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

interface Props {
  heightClass: string;
  widthClass: string;
  mediaType: NFTMediaType;
  numberOfParticles?: number;
  floatingIcon?: string;
  isDuplicate?: boolean; // For displaying multiple times on a page use different IDs. Limited to 2
}

export const CollectivesInteractiveBackground: React.FC<Props> = ({
  heightClass = 'w-full',
  widthClass = 'h-full',
  mediaType,
  numberOfParticles = 40,
  floatingIcon,
  isDuplicate = false
}) => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div
      className={`relative ${heightClass} ${widthClass} overflow-hidden select-none`}
    >
      <Particles
        id={isDuplicate ? 'particles-js-duplicate' : 'particles-js'}
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
              value: '#000000'
            },
            shape: {
              type: 'edge',
              stroke: {
                width: 1,
                color: '#90949E'
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
              opacity: 0.4008530152163807,
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
                enable: true,
                rotateX: 1763.753266952075,
                rotateY: 1603.4120608655228
              }
            }
          },
          interactivity: {
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
              {mediaType === NFTMediaType.IMAGE && (
                <img
                  src={floatingIcon}
                  alt="Collective icon"
                  className="w-20 h-20 bg-gray-syn7 select-none"
                />
              )}
              {mediaType === NFTMediaType.VIDEO && (
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
};
