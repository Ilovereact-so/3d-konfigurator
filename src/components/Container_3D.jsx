// App.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, ScrollControls, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll, useTransform , motion, animate} from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { int } from 'three/tsl';
import { MoveUp,ChevronLeft, ChevronRight } from 'lucide-react';

const MODEL_PATH = '/models/blenderfile.glb';
const CHARACTER_ACTION = 'Action';
const CAMERA_ACTION = 'CameraAction';

function GLTFScene({ scrollY ,play, handleLoad }) {
    const actionRef = useRef();
    const { scene, animations, cameras } = useGLTF(MODEL_PATH);
    const { actions } = useAnimations(animations, scene);
    const CameraAnimationRef = useRef()
    const CharacterAnimationRef = useRef()

    handleLoad(scene)

    const { set } = useThree();
    const { size } = useThree();

    const [looping, setLooping] = useState(false);

    scene.traverse((child) => {
      if (child.isSkinnedMesh) {
        child.frustumCulled = false;
      }
    });

    useEffect(() => {
      scene.traverse((child) => {
        if (child.isMesh || child.isGroup) {
          child.visible = true;
          console.log('Found:', child.name);
        }
      });
    }, [scene]);

    useEffect(() => {
      if (cameras.length > 0) {
          const modelCamera = cameras[0];
          modelCamera.fov = 50;
          modelCamera.near = 0.1;
          modelCamera.aspect =  window.innerWidth / window.innerHeight;
          modelCamera.far = 100;
          modelCamera.updateProjectionMatrix();
        set({ camera: modelCamera });
      }

      const charAction = actions[CHARACTER_ACTION];
      const camAction = actions[CAMERA_ACTION];

      if (charAction) {
        charAction.reset().play();
        charAction.paused = true;
        charAction.enabled = true;
        charAction.loop = THREE.LoopOnce;
        charAction.clampWhenFinished = true;
        charAction.time = 0;
        CharacterAnimationRef.current = charAction;
      }

      if (camAction) {
          camAction.reset();
          camAction.play();
          camAction.paused = true;
          camAction.enabled = true;
          camAction.loop = THREE.LoopOnce;
          camAction.clampWhenFinished = true;
          camAction.time = 0;
          CameraAnimationRef.current = camAction;
      }
    }, [actions, cameras, set]);

    useEffect(() => {
      const unsubscribe = scrollY.on("change", (v) => {
        setLooping(v >= 1);
      });
      return () => unsubscribe();
    }, [scrollY]);

    useFrame((state, delta) => {
      if (!CharacterAnimationRef.current || !CameraAnimationRef.current) return;

      const charAction = CharacterAnimationRef.current;
      const camAction = CameraAnimationRef.current;
      const duration = 2.9;
      const TOTAL_DURATION = 6.3;
        const SCROLL_STOP = 0.8;
        const LOOP_START = 3.0;
        const LOOP_END = 4.0;
        const LOOP_DURATION = LOOP_END - LOOP_START;
      if (looping) {
        const now = performance.now() / 4000;
        const time = ((now % LOOP_DURATION) + LOOP_START);
        charAction.time = time;
        charAction._updateTime(time);
      } else {
        charAction.paused = true;
        charAction.setLoop(THREE.LoopOnce);
        charAction.clampWhenFinished = true;

        const t = scrollY.get();
        charAction.time = t * duration;
        charAction._updateTime(charAction.time);

        camAction.time = t * duration;
        camAction._updateTime(camAction.time);
      }
    });

    return <primitive ref={actionRef} object={scene} dispose={null} />;
}

function LightsAndGround() {
  return (
    <>
      <ambientLight position={[0,5,5]} color={0xffffff} intensity={0.6} />
      <hemisphereLight position={[0,10,0]} intensity={1} color={"0xffffff"} groundColor={"0xffffff"} />
      <directionalLight position={[-5,5,11]} intensity={2} color={0xffffff} castShadow={true} />
      <directionalLight position={[5,5,11]} intensity={2} color={0xffffff} castShadow={true} />
    </>
  );
}

export default function App({handleLoad}) {
  const ref = useRef();
  const [play, setPlay] = useState(false);
  const { scrollYProgress } = useScroll();
  const animationProgress = useTransform(scrollYProgress, [0.03,0.1, 1], [0, 0.05,1], {
    clamp: true,
  });
  const [isVisible, setIsVisible] = useState(true);


  function usePageWidth() {
    const [width, setWidth] = useState(window.innerWidth)
    const observerRef = useRef(null)

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth)
      }

      const resizeObserver = new ResizeObserver(() => {
        handleResize()
      })

      resizeObserver.observe(document.body)
      observerRef.current = resizeObserver

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }, [])

    return width
  }
  const ViewportWidth = usePageWidth()
  let mobileViewport = 1024

  const opacity = useTransform(scrollYProgress, [0.5,0.6,1],[0,1,1]);
  const width = useTransform(scrollYProgress, (pos)=>{
    if(pos > 0.9 && ViewportWidth >= mobileViewport){
      return "100%"
    }else if(pos > 0.9 && ViewportWidth < mobileViewport){
      return "100%"
    }else if(pos < 0.9 && ViewportWidth < mobileViewport){
      return "100%"
    }else{
      return "0%"
    }
  });

  const height = useTransform(scrollYProgress, (pos)=>{
    if(pos > 0.9 && ViewportWidth >= mobileViewport){
      return "100%"
    }else if(pos > 0.9 && ViewportWidth < mobileViewport){
      return "100%"
    }else if(pos < 0.9 && ViewportWidth < mobileViewport){
      return "0"
    }else{
      return "100%"
    }
  });

  const paddings = useTransform(scrollYProgress, (pos)=>{
    return pos > 0.9 ? null : 0;
  });

  useEffect(() => {
    const unsubscribe = animationProgress.on("change", (latest) => {
      setIsVisible(latest <= 0.8);
    });
    return () => unsubscribe();
  }, [animationProgress]);

  const [color,setColor] = useState("#227772")
  const [islen, setLen] = useState(176)
  const [iswidth, setWidth] = useState(32)
  return (
    <div className='relative w-full h-[100vh] z-10'>
      <Canvas ref={ref} shadows gl={{ antialias: true, toneMappingExposure: 1, alpha:true, toneMapping: THREE.NeutralToneMapping, outputColorSpace: THREE.SRGBColorSpace}} style={{ width: '100%', height: '100%', background:"transparent", position:"relative",zIndex:9 }}>
        <LightsAndGround />
        <GLTFScene scrollY={animationProgress} play={play} handleLoad={handleLoad} />
        <mesh
          position={[0, 4.215, 0.533]}
          rotation={[0, 0, 0]}
          scale={[2.646, 1, 1.572]}
          frustumCulled={true}
          visible={isVisible}
        >
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial color="rgb(24,23,23)" />
        </mesh>
        <Cylinder2 color={color} len={islen} width={iswidth}/>
      </Canvas>
      <Menu opacity={opacity} width={width} height={height} paddings={paddings} colors={{color, setColor}} len={{islen,setLen}} w={{iswidth, setWidth}}/>
    </div>
  );
}

const Cylinder2 = ({ height = 2, radius = 1, color, len, width, ...props })=>{
  const { scene } = useThree();


  useEffect(() => {
    const cylinderMesh = scene.getObjectByName('Cylinder2'); // <-- nazwa z GLTF
    if (cylinderMesh) {
      // /cylinderMesh.scale.set(1.5, 3, 1.5);
      cylinderMesh.material.color.set(color);
      cylinderMesh.material.roughness = 0.5;
      cylinderMesh.material.reflectivity = 0;
    }
  }, [scene, color]);

  useEffect(()=>{
    const cylinderMesh = scene.getObjectByName('Cylinder2'); // <-- nazwa z GLTF
    if(len >= 50 && len <= 176){
      cylinderMesh.geometry.computeBoundingBox();
      const bbox = cylinderMesh.geometry.boundingBox;
      const modelHeight = bbox.max.y - bbox.min.y;

      const baseScaleY = 0.322;      // oryginalna wysokość w skali
      const basePositionY = 0.334;   // oryginalna pozycja Y przy scaleY = 0.322
      console.log(int(len) / 176)
      const scaleFactor = len / 176 // np. 50% wysokości (możesz podać jako props/useState) 176 - 1
      const newScaleY = baseScaleY * scaleFactor;

      // górna krawędź = basePositionY + (modelHeight * baseScaleY)
      const topY = basePositionY + (modelHeight * baseScaleY);

      // oblicz nową pozycję tak, by górna krawędź była na tym samym poziomie
      const newPositionY = topY - (modelHeight * newScaleY);

      cylinderMesh.scale.y = newScaleY;
      cylinderMesh.position.y = newPositionY;
    }
  },[scene,len])

  useEffect(()=>{
    
     const cylinderMesh = scene.getObjectByName('Cylinder2'); // <-- nazwa z GLTF
    if(width >= 26 && width <= 42){
      const baseScale = 0.322; // 32 - 0.322
      let basepoint = 0.0100625
      cylinderMesh.scale.x = width * 0.0100625 // ;
      cylinderMesh.scale.z = width * 0.0100625;
      console.log(width * 0.0100625)
    }

  },[scene,width])  

  return (
    <Cylinder
        args={[0.014, 0.014, 1, 32]}  // radiusTop, radiusBottom, height, segments
        position={[-4.436, 1, 8.105]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="#1d1c1c" />
    </Cylinder>
  )
}
const Menu = ({opacity, width, height, paddings, colors , len, w}) => {
  const [vcolor, setVcolor] = useState(false)
  const [vinputH, setVinputH] = useState(false)
  const [vinputW, setVinputW] = useState(false)
  const HValidate =(e)=>{
    console.log(e.target.value)
    if( e.target.value > 176 ){
      len.setLen(176)
    }else if(e.target.value < 50){
      len.setLen(50)
    }
    else{
      len.setLen(e.target.value)
    }
  }
    const WValidate =(e)=>{
    console.log(e.target.value)
    if( e.target.value > 42 ){
      w.setWidth(42)
    }else if(e.target.value < 26){
      w.setWidth(26)
    }
    else{
      w.setWidth(e.target.value)
    }
  }
  const handleClick = () => {
    animate(window.scrollY, 0, {
      duration: 5,
      ease: "easeInOut",
      onUpdate: (value) => window.scrollTo(0, value),
    })
  }
  function usePageWidth() {
    const [width, setWidth] = useState(window.innerWidth)
    const observerRef = useRef(null)

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth)
      }

      const resizeObserver = new ResizeObserver(() => {
        handleResize()
      })

      resizeObserver.observe(document.body)
      observerRef.current = resizeObserver

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }, [])

    return width
  }
  const ViewportWidth = usePageWidth()
  let mobileViewport = 1024
  const [isindex, setIndex] = useState(0)
  return (
    <motion.div style={{opacity}} className='absolute bottom-0 right-0 w-[100vw] h-full px-10 pt-10 1ll:pb-10 pb-0 z-9 flex items-center  1ll:flex-row flex-col'>
      <div className='flex flex-col justify-between h-full'>
        <div className='w-full'>
          <h1 className='font-Poppins font-bold text-black opacity-45 leading-[1] 1ll:text-[clamp(45px,8vw,190px)] text-[clamp(45px,13vw,160px)]'>Worek Treningowy</h1>
          <p className='font-Poppins text-[clamp(20px,2vw,36px)] text-[#555555] ml-3 mt-3 relative z-10'>Wybierz swój model i</p>
          <div className='font-Poppins font-bold text-black bg-[#D9D9D9] px-6 py-3 rounded-[50px] inline-block text-[clamp(14px,3vw,20px)] mt-3 ml-3 relative z-10'>zarezerwuj</div>
        </div>
        <div onClick={handleClick} className='w-[40px] h-[40px] flex bg-[#555555] rounded-full justify-center items-center cursor-pointer relative z-10 mb-3 hover:invert-[0.9] ease-in-out duration-300'><MoveUp/></div>
      </div>
      <motion.div className='h-auto 1ll:h-full inline-flex justify-end 1ll:items-center items-end 1ll:w-[600px] 1ll:min-w-[418px] 1ll:max-w-full max-w-[600px] w-full  relative z-10 '>
        <motion.div style={{width, padding:paddings, height }} className='bg-[#1111119f] 1ll:rounded-[50px] rounded-t-[50px] w-full 1ll:h-[80vh] h-auto 1ll:pt-8 pt-5 pb-4 1ll:px-10 flex flex-col justify-between ease-in-out duration-300 1ll:overflow-hidden '>
          <div className='flex flex-col 1ll:justify-start justify-center relative h-full'>
            <h1 className='text-white 1ll:text-[24px] text-[15px] font-bold font-Poppins 1ll:text-left text-center overflow-hidden'>Specyfikacja</h1>
            <p className='text-white text-[20px] mt-4 1ll:inline-block hidden'>Worek</p>
            <motion.label style={{height, padding:paddings}} onClickCapture={()=> {setIndex(isindex > 1 ? 0 : isindex + 1); setVcolor(false)}} className={`mm:p-3 p-2 mm:max-h-[48px] max-h-[38px] overflow-hidden bg-[#D9D9D9] rounded-full absolute right-[0] top-[50%] translate-y-[-50%] translate-x-[50%] cursor-pointer z-10 ${ isindex < 2 ? "1ll:hidden block":"hidden"}`}><ChevronRight/></motion.label>
            <motion.label style={{height, padding:paddings}} onClickCapture={()=> {setIndex(isindex < 1 ? 2 : isindex - 1); setVcolor(false)}} className={`mm:p-3 p-2 mm:max-h-[48px] max-h-[38px] overflow-hidden bg-[#D9D9D9] rounded-full absolute left-[0] top-[50%] translate-y-[-50%] translate-x-[-50%] cursor-pointer z-10 ${ isindex > 0 ? "1ll:hidden block":"hidden"}`}><ChevronLeft/></motion.label>
            <motion.div style={{height}} className='overflow-hidden w-full h-full'>
              <div className={`1ll:w-full w-[300%] 1ll:h-[180px] h-auto font-Poppins flex 1ll:flex-col flex-row 1ll:justify-evenly relative ease-in-out duration-300 ${
                isindex == 0 ? "translate-x-0": isindex == 1 ? "1ll:translate-x-0 translate-x-[-33.3%]" : "1ll:translate-x-0 translate-x-[-66.6%]"
              }`}>
                <div className={`flex  flex-col 1ll:text-[20px] 1ll:basis-0 basis-1/3 mm:px-16 px-10 text-[14px] text-[#949494] items-center 1ll:bg-[#1D1D1D] rounded-[40px] mt-2 1ll:px-8 mm:py-4 mm:pt-4 pt-3`}>
                  <div className=' flex justify-between items-center w-full mb-1'>
                    <p className=''>Długość</p>
                    <label onFocus={()=>setVinputH(true)} onBlur={()=>setVinputH(false)} className='relative max-w-[60px] w-[60px] h-[20px] inline-flex rounded-full bg-[#D9D9D9] overflow-hidden'>
                      <input defaultValue={176} min={50} max={176} onBlur={(e)=> HValidate(e)} onChange={(e)=>len.setLen(e.target.value)} value={len.islen}  type='number' className={`h-full text-[12px]  text-black bg-transparent mr-[2px] ease-in-out duration-300 ${ vinputH ? "w-[60px] text-center":"w-[30px] text-center"}`}/>
                      <span className='font-Poppins text-[12px] text-black'>cm</span>
                    </label>
                  </div>
                  <input type='range' style={ViewportWidth < mobileViewport ? {backgroundImage: `linear-gradient(to right, ${colors.color}, ${colors.color})` , backgroundSize: `${((len.islen - 50) / (176 - 50)) * 100}% 100%`, backgroundRepeat:"no-repeat", accentColor: colors.color}:null} min={50} max={176} onChange={(e)=>len.setLen(e.target.value)} value={len.islen} className={`mt-2 mb-4 w-full appearance-none 1ll:h-[11px] h-[32px] 1ll:rounded-none rounded-full ${ ViewportWidth < mobileViewport ? "hide-thumb": "" }`}/>
                </div>
                <div className='flex basis-1/3 flex-col 1ll:text-[20px] text-[14px] text-[#949494] mm:px-16 px-10 items-center relative 1ll:bg-[#1D1D1D] rounded-[40px] mt-2 1ll:px-8 mm:py-4 mm:pt-4 pt-3 '>
                  <div className='flex justify-between items-center w-full mb-1'>
                    <p>Szerokość</p>
                    <label onFocus={()=>setVinputW(true)} onBlur={()=>setVinputW(false)} className='relative max-w-[60px] w-[60px] h-[20px] inline-flex rounded-full bg-[#D9D9D9] overflow-hidden'>
                      <input defaultValue={32} type='number' onBlur={(e)=>WValidate(e)} onChange={(e)=>w.setWidth(e.target.value)} value={w.iswidth} className={`h-full text-[12px]  text-black bg-transparent mr-[2px] ease-in-out duration-300 ${ vinputW ? "w-[60px] text-center":"w-[30px] text-center"}`}/>
                      <span className='font-Poppins text-[12px] text-black'>cm</span>
                    </label>
                  </div>
                  <input type='range' style={ViewportWidth < mobileViewport ? {backgroundImage: `linear-gradient(to right, ${colors.color}, ${colors.color})` , backgroundSize: `${((w.iswidth - 26) / (42 - 26)) * 100}% 100%`, backgroundRepeat:"no-repeat", accentColor: colors.color}:null} min={26} max={42} onChange={(e)=>w.setWidth(e.target.value)} value={w.iswidth} className={`mt-2 mb-4 w-full appearance-none 1ll:h-[11px] h-[32px] 1ll:rounded-none rounded-full ${ ViewportWidth < mobileViewport ? "hide-thumb": "" }`}/>
                </div>
                <div className='flex basis-1/3 flex-col 1ll:bg-[#1D1D1D] rounded-[40px] mt-2 1ll:px-8 mm:px-16 px-10 py-4 relative'>
                  <div className='flex justify-between 1ll:text-[20px] text-[14px] text-[#949494] items-center'>
                    <p>Kolor</p>
                    <div style={{backgroundColor:colors.color}} className='w-[30px] h-[20px] rounded-full cursor-pointer' onClick={()=>{ setVcolor(!vcolor);
                      if(ViewportWidth > mobileViewport) { setIndex(isindex != 2 ? 2 : 0 )}}}></div>
                  </div>
                  <div className={`w-full flex ss:flex-row flex-col-reverse 1ll:justify-end justify-center items-center mt-3 overflow-hidden  ${ !vcolor ? " h-0" : "h-full"}`}>
                    <div className='flex ss:flex-col justify-evenly items-start w-full 1ll:mt-0 mt-2 h-full'>
                      <div onClick={()=> colors.setColor("#865c50")} className='w-[30px] h-[30px] bg-[#865c50] rounded-full cursor-pointer'></div>
                      <div onClick={()=> colors.setColor("#6d7e4c")} className='w-[30px] h-[30px] bg-[#6d7e4c] rounded-full cursor-pointer'></div>
                      <div onClick={()=> colors.setColor("#227772")} className='w-[30px] h-[30px] bg-[#227772] rounded-full cursor-pointer'></div>
                      <div onClick={()=> colors.setColor("#92689c")} className='w-[30px] h-[30px] bg-[#92689c] rounded-full cursor-pointer'></div>
                    </div>
                    <div>
                      <HexColorPicker color={colors.color} onChange={colors.setColor} />                      
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
          <div className='text-black bg-[#D9D9D9] text-[18px] w-full py-3 rounded-full px-5 text-center font-Poppins 1ll:flex hidden justify-center'>Zmiany w czasie rzeczywistym</div>
        </motion.div>
      </motion.div>
      <p className={`absolute bottom-3 right-5 font-Poppins text-[14px] text-black 1ll:flex hidden `}>*Strona służy tylko i wyłącznie celom prezentacyjnym technik 3D</p>
    </motion.div>
  )
}
