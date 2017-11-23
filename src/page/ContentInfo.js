/**
 * Created by Mason Jackson in Office on 2017/11/23.
 */
import React from 'react';
import {Carousel, Row, Col} from 'antd';
import '../style/ContentInfo.scss';
import slider1 from '../image/slider1.jpg';
import slider2 from '../image/slider2.jpg';
import slider3 from '../image/slider3.jpg';
export default class ContentInfo extends React.Component{
        constructor(){
                super();
        }

        render(){
                return (
                        <article>
                                <section className='carouselSection'>
                                        <Carousel autoplay className='homeCarousel'>
                                                <div><img src={slider1} /> </div>
                                                <div><img src={slider2} /> </div>
                                                <div><img src={slider3} /> </div>
                                        </Carousel>
                                        <div className='carouselCaptionDiv'>
                                                <Row>
                                                        <Col xl={20}  lg={20}  md={12}  offset={2}>
                                                                <h1>Providing Professional Service</h1>
                                                                <h4>For elders suffering Alzheimer</h4>
                                                        </Col>
                                                </Row>
                                        </div>
                                </section>

                        </article>
                )
        }
}