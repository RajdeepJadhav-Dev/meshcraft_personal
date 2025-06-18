import React, { useContext, useEffect, useRef, useState, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import authContext from "../context/authContext";
import { FaArrowCircleLeft, FaShoppingCart, FaCreditCard, FaHeart, FaShare, FaCube, FaStar, FaStarHalfAlt } from "react-icons/fa";


// Camera control component
const CameraController = ({ targetPosition, targetLookAt, onTransitionComplete }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!targetPosition || !controlsRef.current) return;

    setIsTransitioning(true);
    
    const controls = controlsRef.current;
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const targetPos = new THREE.Vector3(...targetPosition);
    const targetLookAtPos = new THREE.Vector3(...(targetLookAt || [0, 0, 0]));
    
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeInOut = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Interpolate camera position
      camera.position.lerpVectors(startPosition, targetPos, easeInOut);
      
      // Interpolate look-at target
      controls.target.lerpVectors(startTarget, targetLookAtPos, easeInOut);
      
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
        if (onTransitionComplete) onTransitionComplete();
      }
    };

    animate();
  }, [targetPosition, targetLookAt, camera, onTransitionComplete]);

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true} 
      enableZoom={true} 
      enableRotate={true}
      makeDefault
    />
  );
};

const Model = ({ idleModelUrl, walkModelUrl, rotation, isAnimating, selectedAnimation }) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mixer = useRef(null);
  const actions = useRef({});
  const modelRef = useRef(null);
  const previousAnimStateRef = useRef(isAnimating);

  useEffect(() => {
    const loader = new GLTFLoader();
    const url = selectedAnimation === 'walk' ? walkModelUrl : idleModelUrl;
    
    setLoading(true);
    setError(null);
    
    // Validate URL before attempting to load
    if (!url || typeof url !== 'string' || url.trim() === '') {
      console.warn("Invalid model URL:", url);
      setLoading(false);
      setError("No model URL provided");
      return;
    }

    // Check if URL looks like a valid model file
    const validExtensions = ['.gltf', '.glb'];
    const hasValidExtension = validExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    if (!hasValidExtension) {
      console.warn("URL doesn't appear to be a valid GLTF/GLB file:", url);
      setLoading(false);
      setError("Invalid model file format");
      return;
    }

    loader.load(
      url,
      (gltf) => {
        if (modelRef.current) {
          modelRef.current.parent?.remove(modelRef.current);
          if (mixer.current) mixer.current.stopAllAction();
          actions.current = {};
        }

        const newModel = gltf.scene;
        modelRef.current = newModel;
        setModel(newModel);
        setLoading(false);
        setError(null);

        const newMixer = new THREE.AnimationMixer(newModel);
        mixer.current = newMixer;

        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.forEach((clip, index) => {
            const action = newMixer.clipAction(clip);
            const name = clip.name || `animation_${index}`;
            actions.current[name] = action;
          });

          if (isAnimating && Object.keys(actions.current).length > 0) {
            const firstAction = Object.values(actions.current)[0];
            firstAction.reset().play();
          }
        }
      },
      (progress) => {
        // Optional: Add loading progress handling
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error("Error loading model from URL:", url);
        console.error("Error details:", error);
        
        setLoading(false);
        
        // Check if it's the HTML response error
        if (error.message && error.message.includes('Unexpected token')) {
          setError("Model file not found or inaccessible");
          console.error("Model URL returned HTML instead of model data. Check if the URL is correct and accessible.");
        } else {
          setError("Failed to load 3D model");
        }
      }
    );

    return () => {
      if (mixer.current) mixer.current.stopAllAction();
    };
  }, [idleModelUrl, walkModelUrl, selectedAnimation]);

  useEffect(() => {
    if (!mixer.current || Object.keys(actions.current).length === 0) return;
    if (isAnimating !== previousAnimStateRef.current) {
      if (isAnimating) {
        const firstAction = Object.values(actions.current)[0];
        firstAction.reset().fadeIn(0.5).play();
      } else {
        mixer.current.stopAllAction();
      }
      previousAnimStateRef.current = isAnimating;
    }
  }, [isAnimating]);

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta);
  });

  if (loading) {
    return (
      <>
        <mesh rotation={[0, 0, 0]} scale={[1, 1, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
      </>
    );
  }

  if (error || !model) {
    return (
      <>
        <mesh rotation={[0, 0, 0]} scale={[1, 1, 1]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#444444" wireframe />
        </mesh>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Environment preset="sunset" />
      </>
    );
  }
  return (
    <>
      <primitive object={model} rotation={rotation} scale={1} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <spotLight position={[10, 15, 10]} angle={0.3} intensity={1.5} />
      <Environment preset="sunset" />
    </>
  );
};

const AssetDetailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("Id");
  const navigate = useNavigate();
  const { editAssetData } = useContext(authContext);
  const asset = editAssetData.find((a) => a._id === id);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState("idle");
  const [quantity, setQuantity] = useState(2);
  const [cameraTarget, setCameraTarget] = useState(null);
  const [cameraLookAt, setCameraLookAt] = useState(null);
  const [activeView, setActiveView] = useState('perspective');

  if (!asset) return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-purple-900 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-xl font-light">Asset not found</p>
      </div>
    </div>
  );

  const { title, extendedDescription, price, modelUrl, walkModelUrl, rotation = [0, 0, 0], technical } = asset;
  
  // Default camera position based on model
  let defaultCameraPosition = [0, 7, 11];
  if (title === "Windmill") defaultCameraPosition = [0, 7, 30];
  else if (title === "Small Barracks") defaultCameraPosition = [0, 7, 40];
  else if (title === "Wood Yard") defaultCameraPosition = [0, 7, 20];
  else if (title === "Mine") defaultCameraPosition = [0, 7, 20];
  else if (title === "Duck") defaultCameraPosition = [0, 7, 23];
  else if (title === "Granitor") defaultCameraPosition = [0, 7, 1];
  else if (title === "Campfire") defaultCameraPosition = [0, 7, 50];
  else if (title === "Zombie") defaultCameraPosition = [0, 0.1, 6];
  else if (title === "Knife") defaultCameraPosition = [0, 0, 10];

  // Calculate appropriate distances based on the default camera position
  const distance = Math.sqrt(
    defaultCameraPosition[0] ** 2 + 
    defaultCameraPosition[1] ** 2 + 
    defaultCameraPosition[2] ** 2
  );

  // Camera view configurations
  const cameraViews = {
    perspective: {
      position: defaultCameraPosition,
      lookAt: [0, 0, 0],
      label: 'Perspective'
    },
    front: {
      position: [0, 0, distance],
      lookAt: [0, 0, 0],
      label: 'Front'
    },
    back: {
      position: [0, 0, -distance],
      lookAt: [0, 0, 0],
      label: 'Back'
    },
    left: {
      position: [-distance, 0, 0],
      lookAt: [0, 0, 0],
      label: 'Left'
    },
    right: {
      position: [distance, 0, 0],
      lookAt: [0, 0, 0],
      label: 'Right'
    },
    top: {
      position: [0, distance, 0],
      lookAt: [0, 0, 0],
      label: 'Top'
    },
    bottom: {
      position: [0, -distance, 0],
      lookAt: [0, 0, 0],
      label: 'Bottom'
    }
  };

  const handleCameraView = (viewKey) => {
    const view = cameraViews[viewKey];
    setCameraTarget(view.position);
    setCameraLookAt(view.lookAt);
    setActiveView(viewKey);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-purple-900 min-h-screen text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-10 w-32 h-32 bg-gradient-to-br from-purple-600/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

     

      {/* Back Button */}
      <div className="relative z-10 px-8 py-4">
        <button
          onClick={() => navigate("/marketplace")}
          className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-all duration-300 group"
        >
          <FaArrowCircleLeft className="group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span className="font-medium">Back to Marketplace</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex px-8 gap-12 min-h-[600px]">
        {/* Left - 3D Model Viewer */}
        <div className="flex-1">
          <div className="relative w-full h-[550px] bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <Canvas camera={{ position: defaultCameraPosition, fov: 50 }} style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%)" }}>
              <Suspense fallback={
                <mesh rotation={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color="gray" />
                </mesh>
              }>
                <Model
                  idleModelUrl={modelUrl}
                  walkModelUrl={walkModelUrl}
                  rotation={rotation}
                  isAnimating={isAnimating}
                  selectedAnimation={selectedAnimation}
                />
                <CameraController 
                  targetPosition={cameraTarget} 
                  targetLookAt={cameraLookAt}
                  onTransitionComplete={() => {
                    setCameraTarget(null);
                    setCameraLookAt(null);
                  }}
                />
              </Suspense>
            </Canvas>
            
            {/* Top right controls */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <button className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300 group">
                <FaHeart className="text-white text-sm group-hover:text-red-400 transition-colors duration-300" />
              </button>
              <button className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
                <FaShare className="text-white text-sm" />
              </button>
              <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-white text-xs font-bold uppercase tracking-wider">MESHCRAFT</span>
              </div>
            </div>
          </div>

          {/* Camera View Controls */}
          <div className="mt-6">
           
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(cameraViews).map(([key, view]) => (
                <button
                  key={key}
                  onClick={() => handleCameraView(key)}
                  className={`h-12 rounded-xl flex items-center justify-center text-xs font-bold uppercase tracking-wide transition-all duration-300 border-2 transform hover:scale-105 ${
                    activeView === key 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/25' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-600/50 hover:border-gray-500/50 backdrop-blur-sm'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Product Details */}
        <div className="w-96 space-y-8">
          {/* Title and Rating */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold uppercase tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1,2,3,4].map((star) => (
                  <FaStar key={star} className="text-yellow-400 text-lg" />
                ))}
                <FaStarHalfAlt className="text-yellow-400 text-lg" />
              </div>
              
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r bg-white bg-clip-text text-transparent">
                  {price}
                </div>
                <div className="text-sm text-gray-400 mt-1">Premium Quality Asset</div>
              </div>
              <div className="flex items-center bg-gray-900/50 rounded-full border border-gray-600/50">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 flex items-center justify-center text-white font-bold hover:bg-gray-700/50 rounded-l-full transition-colors duration-200"
                >
                  -
                </button>
                <span className="px-6 py-2 text-xl font-semibold min-w-[60px] text-center">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 flex items-center justify-center text-white font-bold hover:bg-gray-700/50 rounded-r-full transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-[1.02]">
                BUY NOW
              </button>
              <button className="w-full bg-gray-700/50 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-600/50 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50 backdrop-blur-sm transform hover:scale-[1.02]">
                ADD TO CART
              </button>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Objects', value: technical?.objects ?? "1" },
                { label: 'Vertices', value: technical?.vertices ?? "2,000" },
                { label: 'Edges', value: technical?.edges ?? "1,950" },
                { label: 'Faces', value: technical?.faces ?? "975" },
                { label: 'Triangles', value: technical?.triangles ?? "975" },
                { label: 'Format', value: 'GLTF/GLB' }
              ].map((spec, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-b-0">
                  <span className="text-gray-400">{spec.label}</span>
                  <span className="text-white font-semibold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Description Section */}
      <div className="relative z-10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
              Asset Description
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Description Content */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50 shadow-2xl">
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <FaCube className="text-white text-sm" />
                  </span>
                  MESHCRAFT® presents: {title}
                </h3>
                <div className="w-full h-px bg-gradient-to-r from-cyan-400/50 via-purple-500/50 to-transparent mb-6"></div>
              </div>
              
              <div className="space-y-6 text-gray-200 leading-relaxed">
                <p className="text-xl font-light">
                  {extendedDescription || "Start your engines! High octane action is around every corner with customisable, lightning fast cars across open wheel, stock, touring, rally and more. Modular parts, openable doors, bonnets, hoods, trunks and 16 custom liveries give unique ways to personalise, and bring life to your courses and characters!"}
                </p>
                
                <p className="text-lg text-gray-300">
                  Build out your racing world with modular grandstand and tunnel sets, announcers, crowds, drivers and pit crews and feel the adrenaline soar! This premium 3D asset is crafted with meticulous attention to detail, ensuring optimal performance and visual fidelity across all major game engines and 3D applications.
                </p>

                {/* Feature highlights */}
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-white mb-4">Key Features</h4>
                    <ul className="space-y-3">
                      {[
                        'Optimized for real-time rendering',
                        'Industry-standard topology',
                        'Multiple LOD levels included',
                        'PBR materials and textures'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                          <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-white mb-4">Compatible With</h4>
                    <ul className="space-y-3">
                      {[
                        'Unity 3D Engine',
                        'Unreal Engine 4/5',
                        'Blender & Maya',
                        'Web-based applications'
                      ].map((platform, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                          <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></span>
                          {platform}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quality guarantee */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-2xl p-8 mt-12 border border-cyan-400/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <FaStar className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Quality Guarantee</h4>
                      <p className="text-cyan-400 text-sm">Premium assets backed by our satisfaction promise</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Each asset undergoes rigorous quality testing to ensure it meets our high standards for geometry, 
                    texturing, and performance optimization. We stand behind every product with our commitment to excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default AssetDetailPage;