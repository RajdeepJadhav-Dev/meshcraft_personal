import { Canvas, extend, useLoader } from "@react-three/fiber";
import React, { Suspense, useRef, useState, useEffect, useContext, useMemo, useCallback } from "react";
import { OrbitControls, useGLTF, useTexture, Environment } from "@react-three/drei";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authContext from "../context/authContext";
import Nav from "./Nav";
import blenderLogo from "../assets/assets/softwareLogo/Blender.png"
import mayaLogo from "../assets/assets/softwareLogo/Maya.png"
import unityLogo from "../assets/assets/softwareLogo/Unity3D.png"

extend({});

const Model = ({ modelUrl, scale, rotation }) => {


  if (!modelUrl) return null;

  const defaultScale = scale && scale.length ? scale : [1, 1, 1];
  const defaultRotation = rotation && rotation.length ? rotation : [0, 0, 0];
  const fileExtension = modelUrl.split(".").pop().toLowerCase();

  if (["glb", "fbx"].includes(fileExtension)) {
    const { scene } = useGLTF(modelUrl);
    return (
      <>
        <primitive
          object={scene}
          scale={defaultScale}
          rotation={defaultRotation}
          position={[2, -5, -10]}
        />
        <Environment preset="sunset" />
      </>
    );
  } else {
    const texture = useTexture(modelUrl);
    return (
      <>
        <mesh scale={defaultScale} rotation={defaultRotation} position={[2, -5, -10]}>
          <planeGeometry args={[5, 5]} />
          <meshBasicMaterial map={texture} />
        </mesh>
        <Environment preset="sunset" />
      </>
    );
  }
};

// Fixed ProductCard component with proper logo handling
const ProductCard = ({ asset, onClick }) => {




  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailSrc = asset.image || asset.modelUrl;

  // Create a mapping of software names to logo URLs
 const softwareLogos = {
  blender: blenderLogo,
  maya: mayaLogo,
  "unity": unityLogo,
  "unity3d": unityLogo,
  "unity 3d": unityLogo,
  "3ds max" : unityLogo
};

  // Get the appropriate logo for the software
const getSoftwareLogo = (softwareName) => {
  const name = softwareName?.toLowerCase().trim();
  return softwareLogos[name] || asset.softwareLogo;
};


  console.log({
  software: asset.software,
  resolvedLogo: getSoftwareLogo(asset.software)
});
console.log("softwareLogos:", softwareLogos);

  return (
    <div
      onClick={() => onClick(asset)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      className={`group relative cursor-pointer transform transition-all duration-500 ease-out ${
        isPressed ? "scale-95" : isHovered ? "scale-[1.02] -translate-y-2" : ""
      }`}
    >
      {/* Glassmorphism container */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl pb-4 overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 text-center bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
        
        {/* Floating orbs for depth */}
        <div className="absolute -top-20 -right-20 w-40 h-40 text-center bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-blue-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
        
        {/* Image container with glassmorphism frame */}
        <div className="relative mb-6 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10">
          <div className="aspect-[4/3] overflow-hidden">
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc}
                alt={asset.title || 'Asset thumbnail'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full text-center h-full flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a4 4 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white/60 text-sm">No Preview</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full">
            <span className="text-black font-semibold text-sm">{asset.price}</span>
          </div>
        </div>
        
        {/* Content section */}
        <div className="relative z-10 text-center space-y-4">
          {/* Title and description */}
          <div>
            <h3 className="text-white text-center font-bold text-xl mb-2 line-clamp-1 group-hover:text-blue-200 transition-colors duration-300">
              {asset.title}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
              {asset.description}
            </p>
          </div>
          
          {/* Software info with glassmorphism pill */}
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-full">
              {getSoftwareLogo(asset.software) ? (
                <img 
                  src={getSoftwareLogo(asset.software)} 
                  alt={asset.software} 
                  className="w-5 h-5 rounded-full object-cover" 
                />
              ) : (
                <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {asset.software ? asset.software.charAt(0).toUpperCase() : 'S'}
                  </span>
                </div>
              )}
              <span className="text-white/90 text-sm font-medium">{asset.software}</span>
            </div>
          </div>

          {/* Action indicator */}

        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};
// Enhanced TextureCard with circular glassmorphism design
const TextureCard = ({ asset, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailSrc = asset.image || asset.modelUrl;

  return (
    <div
      onClick={() => onClick(asset)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      className={`group relative cursor-pointer transform transition-all duration-500 ease-out ${
        isPressed ? "scale-95" : isHovered ? "scale-[1.05] -translate-y-3" : ""
      }`}
    >
      {/* Main glassmorphism container */}
      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 min-h-[400px] flex flex-col items-center justify-center">
        
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
        
        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
         <div
  key={i}
  className={`absolute w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-[${i * 200}ms]`}
  style={{
    top: `${20 + i * 25}%`,
    left: `${15 + i * 30}%`,
    animation: isHovered ? `float 3s ease-in-out infinite ${i * 0.5}s` : 'none',
  }}
></div>
        ))}
        
        {/* File type and price badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full">
            <span className="text-white/90 text-xs font-semibold">
              {asset.modelUrl?.split('.').pop()?.toUpperCase() || 'FILE'}
            </span>
          </div>
          <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-xl border border-green-400/30 px-3 py-1.5 rounded-full">
            <span className="text-green-200 text-xs font-semibold">
              {asset.price === '0' ? "Free" : asset.price}
            </span>
          </div>
        </div>
        
        {/* Central circular image with multiple glassmorphism layers */}
        <div className="relative mb-6">
          {/* Outer glow ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* Middle ring */}
          <div className="absolute -inset-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full"></div>
          
          {/* Inner image container */}
          <div className="relative w-40 h-40 rounded-full overflow-hidden bg-black/20 backdrop-blur-sm border-2 border-white/20 group-hover:border-white/40 transition-all duration-500">
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc}
                alt={asset.alt || asset.title || 'Texture thumbnail'}
                className="w-full h-full  object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <span className="text-white/60 text-xs">No Preview</span>
                </div>
              </div>
            )}
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </div>
          
          {/* Rotating ring effect */}
          <div className="absolute -inset-3 border-2 border-transparent bg-gradient-to-r from-purple-400/30 via-transparent to-pink-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.3), transparent, rgba(236, 72, 153, 0.3), transparent)',
            animation: isHovered ? 'spin 4s linear infinite' : 'none'
          }}></div>
        </div>
        
        {/* Content section with glassmorphism separator */}
        <div className="relative z-10 text-center w-full">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
          
          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-200 transition-colors duration-300">
            {asset.title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
            {asset.description}
          </p>
          
          {/* Interaction indicator */}
          <div className="mt-4 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
            <div className="w-8 h-[2px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            <div className="w-4 h-[2px] bg-white/30 rounded-full"></div>
            <div className="w-2 h-[2px] bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};


/* Minimal CSS additions - Add to your global CSS */
/*
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
*/
const FullscreenCard = ({ asset, onClose, filteredAssets, onAssetClick }) => {
  const thumbnailSrc = asset.image || asset.modelUrl;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 text-white p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-gray-800 to-gray-950 rounded-lg shadow-lg shadow-blue-500/20 w-full max-w-6xl h-auto max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-blue-500/30">
        <div className="flex-1 flex flex-col items-center p-4">
          <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border border-blue-500/30 bg-gradient-to-b from-gray-900 to-black">
            {thumbnailSrc ? (
               <img
                 src={thumbnailSrc}
                 alt={asset.title || 'Asset full view'}
                 className="object-contain w-full h-full"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-gray-700">
                 <span className="text-gray-500">No preview available</span>
               </div>
             )}
          </div>
          <div className="w-full mt-6 text-center">
            <h2 className="text-2xl font-bold mb-2 text-blue-300">{asset.title}</h2>
            <p className="text-sm mb-3 text-gray-300">{asset.description}</p>
            <p className="text-lg mb-3 font-semibold">Price: <span className="text-blue-300">{asset.price}</span></p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {asset.softwareLogo ? (
                <img src={asset.softwareLogo} alt={asset.software} className="w-6 h-6 border border-blue-400 rounded-full p-1" />
              ) : (
                <img src="https://via.placeholder.com/24x24/4f46e5/ffffff?text=S" alt={asset.software} className="w-6 h-6 border border-blue-400 rounded-full p-1" />
              )}
              <p className="text-sm text-gray-300">{asset.software}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg transform transition-transform duration-200 hover:bg-red-700 active:scale-95 hover:shadow-lg"
                onClick={onClose}
              >
                Close
              </button>
              <Link
                to={`/asset/${asset.title}?Id=${asset._id}`}
                state={{ asset: asset, showFullscreen: true }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transform transition-transform duration-200 active:scale-95 hover:shadow-lg"
              >
                View Asset
              </Link>
            </div>
          </div>
        </div>
        <Sidebar assets={filteredAssets} onAssetClick={onAssetClick} />
      </div>
    </div>
  );
};
      
const MarketPlace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { editAssetData } = useContext(authContext);

  // Remove fullscreen state management since we're not using popups anymore
  const [filters, setFilters] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem("filters");
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Error parsing filters from local storage", e);
        localStorage.removeItem("filters");
        return [];
      }
    }
    return [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleAssets, setVisibleAssets] = useState(12);
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [showTextures, setShowTextures] = useState(false);

  useEffect(() => {
     setIsLoading(true);
     const timeoutId = setTimeout(() => {
       const initialData = editAssetData || [];
       console.log("Marketplace: Received editAssetData:", initialData.length, "items");
       setAssets(initialData);
       setIsLoading(false);
     }, 100);

     return () => clearTimeout(timeoutId);
  }, [editAssetData]);

  const { modelAssets, textureAssets } = useMemo(() => {
    if (!assets || assets.length === 0) {
      return { modelAssets: [], textureAssets: [] };
    }
    return {
      modelAssets: assets.filter((asset) => asset && asset.poly !== "Texture"),
      textureAssets: assets.filter((asset) => asset && asset.poly === "Texture")
    };
  }, [assets]);

  // Search filtering function
  const filterBySearch = useCallback((assetList) => {
    if (!searchTerm.trim()) return assetList;
    
    const searchLower = searchTerm.toLowerCase();
    return assetList.filter(asset => 
      asset.title?.toLowerCase().includes(searchLower) ||
      asset.description?.toLowerCase().includes(searchLower) ||
      asset.software?.toLowerCase().includes(searchLower) ||
      asset.poly?.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  useEffect(() => {
    let currentlyShowingTextures = false;
    let baseAssets;
    
    if (filters.length > 0) {
      if (filters.includes("Texture")) {
        baseAssets = textureAssets;
        currentlyShowingTextures = true;
      } else {
        baseAssets = modelAssets.filter((asset) => filters.includes(asset.poly));
        currentlyShowingTextures = false;
      }
    } else {
      baseAssets = modelAssets;
      currentlyShowingTextures = false;
    }
    
    // Apply search filter to the base assets
    const searchFiltered = filterBySearch(baseAssets);
    setFilteredAssets(searchFiltered);
    setShowTextures(currentlyShowingTextures);

    if (typeof window !== 'undefined' && window.localStorage) {
        try{
           localStorage.setItem("filters", JSON.stringify(filters));
        } catch(e){
            console.error("Error saving filters to local storage", e);
        }
    }
     setVisibleAssets(12);
  }, [filters, modelAssets, textureAssets, filterBySearch]);

  const handleFilterClick = useCallback((filter) => {
    if (filter === "Texture") {
      if (filters.length === 1 && filters.includes("Texture")) {
        setFilters([]);
      } else {
        setFilters(["Texture"]);
      }
    } else {
      const otherFilters = filters.filter((f) => f !== "Texture");
      if (otherFilters.includes(filter)) {
        setFilters(otherFilters.filter((f) => f !== filter));
      } else {
        setFilters([...otherFilters, filter]);
      }
    }
  }, [filters]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setVisibleAssets(12); // Reset visible assets when search changes
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setVisibleAssets(12);
  }, []);

  const assetsToDisplay = useMemo(() => {
      if(showTextures) {
          return filteredAssets.slice(0, visibleAssets);
      } else if (filters.length > 0) {
          return filteredAssets.slice(0, visibleAssets);
      } else {
          // When no filters are applied, show both models and textures
          const searchedModels = filterBySearch(modelAssets);
          const searchedTextures = filterBySearch(textureAssets);
          
          const modelsToShow = searchedModels.slice(0, visibleAssets);
          const remainingSlots = visibleAssets - modelsToShow.length;
          const texturesToShow = remainingSlots > 0 ? searchedTextures.slice(0, remainingSlots) : [];
          return [...modelsToShow, ...texturesToShow];
      }
  }, [filteredAssets, modelAssets, textureAssets, visibleAssets, showTextures, filters, filterBySearch]);

  const totalAssetsAvailable = useMemo(() => {
      if (showTextures) return filterBySearch(textureAssets).length;
      if (filters.length > 0) return filteredAssets.length;
      return filterBySearch(modelAssets).length + filterBySearch(textureAssets).length;
  }, [showTextures, filters, filteredAssets, modelAssets, textureAssets, filterBySearch]);

  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined' && document &&
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
        visibleAssets < totalAssetsAvailable && !isLoading)
     {
      setVisibleAssets(prev => prev + 12);
    }
  }, [visibleAssets, totalAssetsAvailable, isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Modified handleCardClick to navigate directly to single asset page
  const handleCardClick = useCallback((asset) => {
    navigate(`/asset/${asset.title}?Id=${asset._id}`, {
      state: { asset: asset }
    });
  }, [navigate]);

  return (
    <>
    <Nav></Nav>
      <section className="bg-gradient-to-br from-gray-950 via-black to-gray-900 min-h-screen py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-white px-4 sm:px-8 md:px-16">
          <div className="flex flex-col items-center mt-20 mb-8">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">Browse Marketplace</h1>
            <h3 className="text-xl text-gray-400">Premium 3D Assets for Your Next Big Project</h3>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="md:w-1/2 flex flex-col justify-center">
              <div className="relative flex items-center justify-center border border-gray-600/50 rounded-xl mb-4 bg-gray-900/30 backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Search 3D assets..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full py-3 px-4 bg-transparent text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <div className="absolute right-3 flex items-center space-x-2">
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
                      title="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  )}
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {["High Poly", "Medium Poly", "Low Poly", "Texture"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-5 py-2.5 rounded-full transition-all duration-300 active:scale-95 font-medium text-sm backdrop-blur-sm ${
                      filters.includes(filter)
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50"
                        : "bg-gray-900/40 text-white border border-gray-600/50 hover:bg-gray-800/60 hover:border-gray-500/50 hover:shadow-lg"
                    }`}
                    onClick={() => handleFilterClick(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Search results indicator */}
              {searchTerm && (
                <div className="text-center text-gray-400 text-sm mb-4">
                  {totalAssetsAvailable === 0 
                    ? `No assets found for "${searchTerm}"`
                    : `Found ${totalAssetsAvailable} asset${totalAssetsAvailable !== 1 ? 's' : ''} for "${searchTerm}"`
                  }
                </div>
              )}
            </div>
          </div>

          {isLoading && assets.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="ml-4 text-lg text-gray-300">Loading assets...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mt-6 px-8 mx-50  max-w-7xl">
              {assetsToDisplay.length > 0 ? (
                assetsToDisplay.map((asset, index) =>
                  asset.poly === "Texture" ? (
                     <TextureCard key={`texture-${asset._id || index}`} asset={asset} onClick={handleCardClick} />
                  ) : (
                     <ProductCard key={`asset-${asset._id || index}`} asset={asset} onClick={handleCardClick} />
                  )
               )
              ) : (
                !isLoading && (
                  <div className="col-span-full flex flex-col items-center justify-center h-64">
                    {searchTerm ? (
                      <div className="text-center">
                        <div className="w-16 h-16 mb-4 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No assets found</p>
                        <p className="text-gray-500 text-sm mb-4">Try adjusting your search terms or filters</p>
                        <button
                          onClick={clearSearch}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                        >
                          Clear Search
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Please wait while we load your assets...</p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {visibleAssets < totalAssetsAvailable && !isLoading && (
            <div className="flex justify-center items-center mt-8 pb-8 h-16">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="ml-2 text-gray-400">Loading more assets...</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MarketPlace;