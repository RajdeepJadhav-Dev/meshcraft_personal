import React, { useState } from 'react'
import { X, Send, User, Mail, MessageSquare, Briefcase } from 'lucide-react';
import Grid from '../ui/Grid'
import blenderLogo from "../data/62066bb2d7b91b0004122604.png";
import unityLogo from "../data/hd-unity-white-logo-png-701751694709266px4owrpn8p-removebg-preview.png"
import unrealengineLogo from "../data/unreal-engine-4-white-logo-free-png-701751694771339pecyjfnecc-removebg-preview.png"
import photoshopLogo from "../data/photoshop-logo-photoshop-icon-myiconfinder-15.webp"
import substancLogo from "../data/2206923-removebg-preview.png"
import InstaIcon from "../icons/InstaIcon"
import TelegramIcon from '../icons/TelegramIcon';
import TwitterIcon from '../icons/TwitterIcon';
import Nav from './Nav';
import Footer from './Footer';

const ServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.message) {
      alert('Please fill in email and message fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Thank you for your message! We\'ll get back to you soon.');
    setIsModalOpen(false);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <>
    <Nav></Nav>
      <div className='flex justify-center items-center h-screen bg-black'>
        <div className='flex flex-col justify-center items-center pb-16'>
          <div className='text-white pb-8 tracking-widest'>MESHCRAFT</div>
          <div className='text-white text-8xl font-bold'>OUR CORE OFFERINGS</div>
          <div className='text-white pt-10 text-lg'>Delivering industry-leading 3D solutions tailored to your needs.</div>
        </div>
      </div>
      
      <div className='bg-black text-white'>
        <Grid></Grid>
      </div>

      <div className='flex flex-col items-center relative z-0 bg-black h-screen'>
        <h1 className='text-white text-4xl font-bold'>OUR SOFTWARE EXPERTISE</h1>
        <div className='flex gap-x-28 pt-4'>
          <img className='h-24 z-20 relative left-4' src={blenderLogo} alt="" />
          <img className='h-50 relative bottom-15 z-20' src={unityLogo} alt="" />
          <img className='h-24 relative right-4 z-20' src={unrealengineLogo} alt="" />
          <img className='h-20 relative top-2 mx-6 z-20' src={photoshopLogo} alt="" />
          <img className='h-20 relative top-2 ml-6 z-20' src={substancLogo} alt="" />
        </div>

        <div className='relative top-14 flex flex-col items-center justify-center gap-y-7'>
          <h1 className='text-white text-5xl font-bold'>LETS COLLABORATE</h1>
          <h3 className='text-white relative left-5'>If you'd like to discuss a project or require more specific services, you can contact MeshCraft.</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-white bg-[#15182e] p-3 px-5 shadow-2xl rounded-lg transition-all duration-300 hover:scale-105 hover:bg-[#1e2240] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            Contact Me Now
          </button>
        </div>

      
      </div>

      {/* Enhanced Contact Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Enhanced Backdrop */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Enhanced Modal */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-0 max-w-5xl w-full mx-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-gray-700/30 backdrop-blur-sm transform transition-all duration-500 animate-in fade-in-0 zoom-in-95">
            {/* Subtle Accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/3 via-gray-500/3 to-slate-600/3 rounded-2xl"></div>
            
            {/* Enhanced Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-white/10 rounded-full z-50 backdrop-blur-sm border border-gray-600/30"
            >
              <X size={22} />
            </button>

            <div className="flex relative z-10">
              {/* Enhanced Left Side - Contact Information */}
              <div className="bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 p-10 rounded-l-2xl w-2/5 relative overflow-hidden">
                {/* Subtle Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-500/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl font-light text-white mb-2 tracking-wide">Get In Touch</h2>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-gray-400 to-gray-500 mb-10"></div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 text-gray-300 group">
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all duration-300 border border-gray-600/30">
                        <Mail className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-light">contact@sanatcreatives.com</span>
                    </div>
                    
                    <div className="flex items-start gap-4 text-gray-300 group">
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all duration-300 border border-gray-600/30 mt-1">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm font-light leading-relaxed">
                        <div>08 Triveni Tower 3rd Floor, Central Avenue,</div>
                        <div>Gandhipeth, Itwari, Nagpur 440002,</div>
                        <div>India.</div>
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>

              {/* Enhanced Right Side - Form */}
              <div className="p-10 w-3/5 relative">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-light text-white mb-2 tracking-wide">Send us a message</h3>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-gray-400 to-gray-500 mb-8"></div>
                  </div>

                  {/* Enhanced Name Fields Row */}
                  <div className="flex gap-6">
                    <div className="flex-1 group">
                      <label className="block text-sm text-gray-400 mb-3 font-light tracking-wide">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleInputChange}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all duration-300 group-hover:border-gray-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="flex-1 group">
                      <label className="block text-sm text-gray-400 mb-3 font-light tracking-wide">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleInputChange}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all duration-300 group-hover:border-gray-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  {/* Enhanced Email and Phone Row */}
                  <div className="flex gap-6">
                    <div className="flex-1 group">
                      <label className="block text-sm text-gray-400 mb-3 font-light tracking-wide">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all duration-300 group-hover:border-gray-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="flex-1 group">
                      <label className="block text-sm text-gray-400 mb-3 font-light tracking-wide">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all duration-300 group-hover:border-gray-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Enhanced Message Field */}
                  <div className="group">
                    <label className="block text-sm text-gray-400 mb-3 font-light tracking-wide">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all duration-300 resize-none group-hover:border-gray-500"
                      placeholder="Tell us about your project or inquiry..."
                    />
                  </div>

                  {/* Enhanced Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-gray-700 to-gray-600 text-white py-4 px-10 rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] transform hover:scale-105 font-light tracking-wider backdrop-blur-sm border border-gray-600/30"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer id='contact me'></Footer>
    </>
  )
}

export default ServicesPage