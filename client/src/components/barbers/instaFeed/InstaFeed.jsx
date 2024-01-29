import React from 'react'
import './instaFeed.css'
import { Typography } from '@mui/material'
import Slider from 'react-slick';

const settings = {
  dots: true,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const InstaFeed = () => {
  const [feedList, setFeedList] = React.useState([]);

  const getChildrenDetails = async (children, token) => {
    const fields = 'media_type,media_url,thumbnail_url';

    let carouselItemsCount = 0;
    const maxCarouselItems = 2; // Máximo número de elementos de un carrousel
    return Promise.all(
      children.map(async (child) => {
        if (carouselItemsCount < maxCarouselItems) {
          carouselItemsCount++;
          const childDetailsResponse = await fetch(
            `https://graph.instagram.com/${child.id}?access_token=${token}&fields=${fields}`
          );
          return await childDetailsResponse.json();
        }
      })
    );
  };

  const getInstaFeed = React.useCallback(async () => {
    try {
      const token = process.env.REACT_APP_ANDY_INSTA_TOKEN;
      if (!token) {
        console.error("Token de Instagram no válido");
        return;
      }

      const fields = 'media_type,media_url,thumbnail_url,children';
      const url = `https://graph.instagram.com/me/media?access_token=${token}&fields=${fields}`;

      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();

      let carouselItemsCount = 0;
      const maxCarouselItems = 3; // Máximo número de elementos de un carrousel

      const feedData = await Promise.all(
        data.data.map(async (item) => {
          if (item.media_type === 'CAROUSEL_ALBUM' && item.children && item.children.data.length > 0 && carouselItemsCount < maxCarouselItems) {
            carouselItemsCount++;
            return { ...item, childrenDetails: await getChildrenDetails(item.children.data, token) };
          }
          return item;
        })
      );
      console.log(feedData)
      setFeedList(feedData);
    } catch (error) {
      console.error("Error al obtener el feed de Instagram:", error);
    }
  }, []);

  React.useEffect(() => {
    getInstaFeed();
  }, [getInstaFeed]);

  return (
    <section className='containerInstaFeed'>
      {feedList?.map(item => {
        return (
          <div key={item.id} className='itemInstaFeed'>
            {item.media_type === 'IMAGE' && <img src={item.media_url} alt='feed-content' />}
            {item.media_type === 'VIDEO' && (
              <video controls>
                <source src={item.media_url} />
              </video>
            )}
            {item.media_type === 'CAROUSEL_ALBUM' && (
              <div className='carouselContainer'>
                <Slider {...settings}>
                  {item.childrenDetails?.map(child => (
                    <div key={child.id} className='carouselItem'>
                      {child.media_type === 'IMAGE' && <img src={child.media_url} alt='carousel-content' />}
                      {child.media_type === 'VIDEO' && (
                        <video controls>
                          <source src={child.media_url} />
                        </video>
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        )
      })}
      {feedList?.length === 0 && <Typography>No hay cortes publicados</Typography>}
    </section>
  );
};

export default InstaFeed;