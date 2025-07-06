import React from 'react'
import Blender from "../icons/Blender"
import Unity from "../icons/Unity"
import Unreal from "../icons/Unreal"
import homepagep1 from "../assets/homepagep1.png"
import homepage2 from "../assets/homepage2.png"
import homepage3 from "../assets/homepage3.png"
import homepage4 from "../assets/homepage4.png"
import { useState,useEffect } from 'react'
import Model from "./Model"
import Nav from "./Nav"
import texture from "../assets/flowerfront.jpg"
import car from "../assets/our.png"
import man from "../assets/man.jpg"
import humans from "../assets/humans.png"
import structure from "../assets/structure.webp"
import plane from "../assets/plan.webp"
import Footer from "./Footer"
import premium from "../assets/premiumqual.png"
import image247 from "../assets/24-7.png";
import vast from "../assets/vast.png";
import anime from "../assets/anime.png"
import { useNavigate ,Link} from 'react-router-dom';
const HomePage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/marketplace');
  };



  const topRow = [              
    { name: 'Blender', icon:<Blender/> },
    { name: 'Unity', icon: <Unity/> },
    { name: 'Unreal', icon: <Unreal/> },
    { name: 'Blender', icon: <Blender/>},
    { name: 'Unity', icon:  <Unity/>  },
    { name: 'Unreal', icon:  <Unreal/> },
    { name: 'Blender', icon:<Blender/> },
    { name: 'Unity', icon: <Unity/> },
    { name: 'Unreal', icon:  <Unreal/> },
    { name: 'Blender', icon:<Blender/> },
    { name: 'Unity', icon: <Unity/> },
    { name: 'Unreal', icon:  <Unreal/> },
  ];

  const bottomRow = [
    { name: 'Blender', icon:<Blender/> },
    { name: 'Unity', icon: <Unity/> },
    { name: 'Unreal', icon: <Unreal/> },
    { name: 'Blender', icon: <Blender/>},
    { name: 'Unity', icon:  <Unity/>  },
    { name: 'Unreal', icon:  <Unreal/> },
    { name: 'Blender', icon:<Blender/> },
    { name: 'Unity', icon: <Unity/> },
    { name: 'Unreal', icon:  <Unreal/> },
    { name: 'Blender', icon:<Blender/> },
  ];

  const SoftwareCard = ({ name, icon }) => (
    <div className="bg-black border border-white rounded-lg px-4 py-3 flex items-center space-x-3 hover:bg-gray-700/50 transition-colors duration-200">
      <div className="text-white text-lg">
        {icon}
      </div>
      <span className="text-white font-medium text-sm">
        {name}
      </span>
    </div>
  );

  const [visibleSteps, setVisibleSteps] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
 
  const steps = [
    {
      step: "Step 1: Browse the Collection",
      description: "Explore our wide range of high-quality 3D assets for games. Find the perfect assets for your project."
    },
    {
      step: "Step 2: Add to Cart",
      description: "Select the 3D assets you want to purchase and add them to your cart. Review your selection before proceeding to checkout."
    },
    {
      step: "Step 3: Checkout and Payment",
      description: "Complete the checkout process by providing your payment details. Once the payment is confirmed, you will receive a download link."
    },
    {
      step: "Step 4: Download Your Assets",
      description: "Access your purchased 3D assets by downloading them from the provided link. Start using them in your game development projects."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps(prev => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          // Stop animation after completion
          clearInterval(timer);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (visibleSteps > 0) {
      setLineProgress(((visibleSteps - 1) / (steps.length - 1)) * 100);
    }
  }, [visibleSteps]);

  return (
    <>
      <Nav></Nav>
      <div className='flex'>
        <div className='flex flex-col m-10 mt-48 ml-36 tracking-tight relative z-30'>
          <div className='text-7xl font-bold leading-18'>Discover Stunning 3D</div>
          <div className='text-7xl font-bold leading-18'>Assets for your</div>
          <div className='text-7xl font-bold leading-18'>Games</div>
          <div className='my-2 text-gray-300 ml-1'>Elevate Your Gaming Experience with Our Cutting-Edge 3D Creations</div>
          <div>
      <button
        onClick={handleClick}
        className='border-2 border-white px-10 mt-2 py-2 rounded-2xl hover:bg-gray-700/50 transition-colors duration-200'
      >
        Explore Now
      </button>
    </div>
        </div>
        
        <Model></Model>
      </div>

      <div className="bg-black flex items-center justify-center mt-24 ">
        <div className="space-y-4">
          {/* Top Row */}
          <div className="flex space-x-4 py-2 ">
            {topRow.map((software, index) => (
              <SoftwareCard  key={index} name={software.name} icon={software.icon} />
            ))}
          </div>
        </div>
      </div>

      {/* second part of the home page */}
      <div className='flex flex-col '>
        <div className='text-4xl font-bold text-center mt-20'>
          FEATURES THAT MAKE US STANDOUT
        </div>

        <div className='flex mt-20 relative left-26 mx-40 justify-center items-center gap-6 '>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-6">PREMIUM QUALITY</h1>
            <p className='text-gray-300 pr-4'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi ea,
              omnis dolor cumque consequuntur nemo officia distinctio tempora harum
              ullam quae consequatur? Ad ab, distinctio ea necessitatibus corrupti
              vel odio!
            </p>
            <p className='text-gray-300 pr-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit explicabo eligendi odit asperiores ex ipsa quo, doloremque atque aliquid repellendus temporibus tempore laborum quaerat eum, obcaecati sint saepe error fugiat.</p>
            <button onClick={handleClick} className='border-gray-300 text-gray-300 border-2 px-10 mt-5 py-2 rounded-lg'>MORE</button>
          </div>

          <div className='flex-1 flex items-center justify-center'>
            <img src={premium} alt="" className="relative right-20 h-80 object-contain" />
          </div>
        </div>

        <div className='flex mt-20 relative  mx-40 justify-center items-center gap-10 '>
          <div className='flex-1 flex items-center justify-center'>
            <img src={image247} alt="" className="max-w-full h-84 object-contain" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-6">24/7 CUSTOMER SERVICE AND TECH SUPPORT</h1>
            <p className='text-gray-300 pr-4'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi ea,
              omnis dolor cumque consequuntur nemo officia distinctio tempora harum
              ullam quae consequatur? Ad ab, distinctio ea necessitatibus corrupti
              vel odio!
            </p>
            <p className='text-gray-300 pr-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit explicabo eligendi odit asperiores ex ipsa quo, doloremque atque aliquid repellendus temporibus tempore laborum quaerat eum, obcaecati sint saepe error fugiat.</p>
          <Link to="/services#contact me">
  <button className='border-gray-300 text-gray-300 border-2 px-10 mt-5 py-2 rounded-lg'>
    MORE
  </button>
  </Link>
          </div>
        </div>
        
        <div className='flex mt-20 relative left-26 mx-40 justify-center items-center gap-6 '>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-6">VAST SELECTION</h1>
            <p className='text-gray-300 pr-4'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi ea,
              omnis dolor cumque consequuntur nemo officia distinctio tempora harum
              ullam quae consequatur? Ad ab, distinctio ea necessitatibus corrupti
              vel odio!
            </p>
            <p className='text-gray-300 pr-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit explicabo eligendi odit asperiores ex ipsa quo, doloremque atque aliquid repellendus temporibus tempore laborum quaerat eum, obcaecati sint saepe error fugiat.</p>
            <button onClick={handleClick} className='border-gray-300 text-gray-300 border-2 px-10 mt-5 py-2 rounded-lg'>MORE</button>
          </div>

          <div className='flex-1 flex items-center justify-center'>
            <img src={vast} alt="" className="relative right-18 h-86 object-contain" />
          </div>
        </div>

        <div className='flex mt-20 relative  mx-40 justify-center items-center gap-10 '>
          <div className='flex-1 flex items-center justify-center'>
            <img src={anime} alt="" className="max-w-full h-80 object-contain" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-6">Animations</h1>
            <p className='text-gray-300 pr-4'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi ea,
              omnis dolor cumque consequuntur nemo officia distinctio tempora harum
              ullam quae consequatur? Ad ab, distinctio ea necessitatibus corrupti
              vel odio!
            </p>
            <p className='text-gray-300 pr-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit explicabo eligendi odit asperiores ex ipsa quo, doloremque atque aliquid repellendus temporibus tempore laborum quaerat eum, obcaecati sint saepe error fugiat.</p>
            <button onClick={handleClick} className='border-gray-300 text-gray-300 border-2 px-10 mt-5 py-2 rounded-lg'>MORE</button>
          </div>
        </div>
      </div>

      {/*3rd part of the homepage*/}
      <div className='mt-20'>
        <h1 className='text-center text-5xl font-bold mb-2'>How it works</h1>
        <h2 className='text-center text-gray-300'>Follow these steps to purchase and download 3D assets for your games.</h2>
      </div>

      <div className="bg-black py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Steps Container */}
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-700 hidden md:block"></div>
            
            {/* Animated Progress Line */}
            <div 
              className="absolute top-6 left-6 h-0.5 bg-white hidden md:block transition-all duration-1000 ease-out"
              style={{ width: `${lineProgress}%`, maxWidth: 'calc(100% - 48px)' }}
            ></div>
            
            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <div key={index} className="relative">
                  {/* Circle */}
                  <div 
                    className={`w-12 h-12 rounded-full mb-6 relative z-10 transition-all duration-500 transform ${
                      index < visibleSteps 
                        ? 'bg-white scale-100 opacity-100' 
                        : 'bg-gray-700 scale-75 opacity-30'
                    }`}
                  ></div>
                  
                  {/* Content */}
                  <div 
                    className={`text-white transition-all duration-700 transform ${
                      index < visibleSteps 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <h3 className="text-xl font-bold mb-4 leading-tight">
                      {item.step}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*4th part of the homepage*/}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative left-16">
            <h1 className="text-6xl font-bold mb-4 tracking-tight">
              FEATURED<br />
              COLLECTIONS
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Elevate Your Gaming Experience with Our Cutting-Edge 3D Creations
            </p>
            <button onClick={handleClick} className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300">
              Explore Now
            </button>
          </div>

          {/* Triangular Layout - Your Original Design */}
          <div className='relative mt-5 h-96'>
            <img className='h-60 absolute top-0 right-0' src={texture} alt="" />
            <img className='absolute bottom-[390px] right-0 w-[305px]' src={car} alt="" />
            <img className='h-43 absolute bottom-[390px] right-77' src={man} alt="" />
            <img className='absolute bottom-17 right-0 w-[480px] h-18' src={humans} alt="" />
            <img className='h-72 absolute top-8 left-80' src={structure} alt="" />
            <img className='h-44 absolute bottom-18 left-20' src={plane} alt="" />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}

export default HomePage
































