/**
 * Created by Mason Jackson in Office on 2017/11/23.
 */
import React from 'react';
import {Carousel, Row, Col} from 'antd';
import '../style/HomeContent.scss';
import slider1 from '../image/slider1.jpg';
import slider2 from '../image/slider2.jpg';
import slider3 from '../image/slider3.jpg';
export default class HomeContent extends React.Component{
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
                                                                <h1>专业的服务</h1>
                                                                <h4>为广大阿尔茨海默症病友提供帮助</h4>
                                                        </Col>
                                                </Row>
                                        </div>
                                </section>
                                <section className='aboutSection'>
                                        博脑公司致力于阿尔茨海默症智能分析和诊断。博脑公司致力于阿尔茨海默症智能分析和诊断。
                                </section>
                                <section className='serviceSection'>
                                        <h1>我们的服务</h1>

                                </section>
                        </article>
                )
        }
}