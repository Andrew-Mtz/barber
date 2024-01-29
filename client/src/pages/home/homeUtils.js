export const text = {
  royalStudio: {
    firstPartTitle: 'Bienvenido a',
    secondPartTitle: 'Royal Studio',
    infoCards: {
      first: {
        title: 'Herramientas de Calidad',
        desc: 'Contamos con las mejores herramientas y productos para el cuidado y el corte de cabello. Utilizamos productos de alta calidad que aseguran resultados impecables y duraderos.',
        url: 'https://png.pngtree.com/thumb_back/fw800/background/20230407/pngtree-the-tools-of-a-barber-on-the-desktop-in-front-of-photo-image_2344581.jpg'
      },
      second: {
        title: 'Barberos Expertos',
        desc: 'Nuestros barberos son expertos en su oficio y están capacitados para cualquier estilo y tendencia. Su pasión por la barbería se refleja en cada corte y arreglo de barba que realizan.',
        url: 'https://ath2.unileverservices.com/wp-content/uploads/sites/13/2023/07/03194432/corte-de-pelo-hombre-segun-rostro.jpg'
      },
      third: {
        title: 'Buen Ambiente',
        desc: 'Nuestro lugar es más que una barbería, es un espacio acogedor donde puedes relajarte y disfrutar. Contamos con cómodos asientos, entretenimiento como una PS4 para jugar, música y un equipo de cuatro barberos listos para atenderte.',
        url: 'https://cdn.shopify.com/s/files/1/0601/6037/7032/files/La-luz-correcta-para-el-look-correcto-1.jpg?v=1666992320'
      }
    }
  },
  ourServices: {
    title: 'Nuestros servicios',
    book: {
      btnText: 'Agendar',
      paragraph: 'En nuestra barbería, los cortes de pelo son una verdadera expresión de arte. Nuestros talentosos barberos dominan una amplia variedad de estilos, desde los clásicos atemporales hasta las tendencias más vanguardistas. Cada corte es realizado con precisión y dedicación para resaltar tus rasgos faciales y realzar tu estilo único. Además, te ofrecemos asesoramiento personalizado para encontrar el corte perfecto que se adapte a tu personalidad, tipo de cabello y preferencias. Déjanos cuidar de tu cabello y experimenta la confianza que proviene de lucir un corte impecable.'
    },
    comments: {
      btnText: 'Reseñas',
      paragraph: 'Explora nuestra sección de comentarios, donde nuestra comunidad comparte sus experiencias sobre los servicios de nuestros talentosos barberos. Descubre lo que dicen nuestros clientes sobre sus cortes de cabello, colores, diseños y más. Encontrarás opiniones genuinas que te ayudarán a saber si es el lugar correcto para vos. En Royal Studio, valoramos la retroalimentación de nuestros clientes y nos esforzamos por mantener los más altos estándares de calidad.'
    }
  }
};

export const animations = {
  toDesktop: {
    infoCardsAnimation: {
      target: '.container-text',
      from: { scale: 0.5, opacity: 0 },
      to: {
        scale: 1,
        opacity: 1,
        duration: 5,
        scrollTrigger: {
          trigger: '.container-text',
          toggleActions: 'restart play reverse play',
          start: '-250px center',
          end: 'top center',
          scrub: 2
        }
      }
    },
    welcomeTextAnimation: {
      target: '.welcome-text',
      from: { x: 0, opacity: 1 },
      to: {
        x: -300, opacity: 0, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '20% center',
          end: '30% center',
          scrub: true,
        }
      }
    },
    glitchTextAnimation: {
      target: '.glitch',
      from: { x: 0 },
      to: {
        x: '-50%', y: '50%', scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '20% center',
          end: '35% center',
          scrub: true,
        }
      }
    },
    leftText: {
      target: '.divider-and-text',
      from: { x: '-100%', opacity: 0 },
      to: {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '75% 90%',
          end: '85% 90%',
          scrub: 2,
        }
      }
    },
    leftBtn: {
      target: '.left-action-btn',
      from: { x: '200%', opacity: 0 },
      to: {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '75% 90%',
          end: '85% 90%',
          scrub: 2,
        }
      }
    },
    rightText: {
      target: '.text-and-divider',
      from: { x: '100%', opacity: 0 },
      to: {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '85% 90%',
          end: '95% 90%',
          scrub: 2,
        }
      }
    },
    rightBtn: {
      target: '.right-action-btn',
      from: { x: '-200%', opacity: 0 },
      to: {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '85% 90%',
          end: '95% 90%',
          scrub: 2,
        }
      }
    }
  },
  toMobile: {
    infoCardsAnimation: {
      target: '.container-text',
      from: { scale: 0.3, opacity: 0 },
      to: {
        scale: 0.8,
        opacity: 1,
        duration: 5,
        scrollTrigger: {
          trigger: '.container-text',
          toggleActions: 'restart play reverse play',
          start: '-450px 60%',
          end: 'top 60%',
          scrub: 2
        }
      }
    },
    welcomeTextAnimation: {
      target: '.welcome-text',
      from: { opacity: 1 },
      to: {
        y: -300, opacity: 0, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '10% 40%',
          end: '25% 40%',
          scrub: 2,
        }
      }
    },
    glitchTextAnimation: {
      target: '.glitch',
      from: { y: '-90%' },
      to: {
        y: '50%', scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '10% 40%',
          end: '25% 40%',
          scrub: 2,
        }
      }
    },
    leftText: {
      target: '.divider-and-text',
      from: { x: '-50%', opacity: 0 },
      to: {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '65% 90%',
          end: '75% 90%',
          scrub: 2,
        }
      }
    },
    leftBtn: {
      target: '.left-action-btn',
      from: { x: '50%', opacity: 0 },
      to: {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '65% 90%',
          end: '75% 90%',
          scrub: 2,
        }
      }
    },
    rightText: {
      target: '.text-and-divider',
      from: { x: '50%', opacity: 0 },
      to: {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '85% 90%',
          end: '90% 90%',
          scrub: 2,
        }
      }
    },
    rightBtn: {
      target: '.right-action-btn',
      from: { x: '-50%', opacity: 0 },
      to: {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '85% 90%',
          end: '95% 90%',
          scrub: 2,
        }
      }
    }
  }
};