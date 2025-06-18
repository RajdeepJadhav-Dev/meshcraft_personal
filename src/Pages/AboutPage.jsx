import React from 'react'
import meshcraftCircle from "../data/meshcraftCircle.png"
import seoImage from "../data/seo.png"
import chatImage from "../data/chat.png"
import timeImage from "../data/time.png"
import Experience from '../ui/Experience'

const AboutPage = () => {


  const abilities = [
  {
    imgPath: seoImage,
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: chatImage,
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: timeImage,
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];




  return (
    <>
    <div className='bg-black h-[450px] flex flex-col text-8xl  items-center abhaya-extrabold'>
      <div className='relative top-30 tracking-wider left-36'>
    <div className='text-white relative right-56'>Crafting Worlds.</div>
    <div className='flex items-center justify-center'>
    <img src={meshcraftCircle} className='h-24 relative top-1.5' alt="" />
    <div className='text-white'>One Polygon.</div>
    </div>
    <div className='text-white'>At A Time. </div>
    </div>
    </div>
    <div className='bg-black h-[300px]'>
    <h1 className='text-white text-xl mx-[400px] playfair-extrabold tracking-wider text-center'>
      "At Meshcraft, we're dedicated to helping indie game developers like you turn your ideas into reality. We understand the challenges of building a game from the ground up, which is why we're here to support you every step of the way. From detailed 3D models and lifelike characters to breathtaking level designs and seamless animations, we provide everything you need to bring your vision to life. But we're more than just a service — we're your partner on this creative journey."
    </h1>
    <div className='flex justify-center items-center mt-5 text-lg border-1 border-white mx-[695px] rounded-xl  '>
    <button className='text-white '>what we do</button>
    </div>
    </div>


<div className='bg-black   text-white'>
  <div className="w-full padding-x-lg">
    <div className="mx-auto grid-3-cols flex justify-center items-center">
      {abilities.map(({ imgPath, title, desc }) => (
        <div
          key={title}
          className="card-border bg-[#0f0f10] rounded-xl p-8 m-8 flex flex-col gap-4"
        >
          <div className="size-14 flex items-center justify-center rounded-full">
            <img src={imgPath} alt={title} />
          </div>
          <h3 className="text-white text-2xl font-semibold mt-2">{title}</h3>
          <p className="text-white-50 text-lg">{desc}</p>
        </div>
      ))}
    </div>
  </div>
  </div>
  <div className='text-white bg-black relative bottom-16'>
    <Experience></Experience>
  </div>



    </>
  )
}

export default AboutPage