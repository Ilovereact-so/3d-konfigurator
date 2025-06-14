import logo from './logo.svg';
import './App.css';
import Hero from './components/Hero';
import Container_3D from './components/Container_3D';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import {motion} from 'framer-motion'

function App() {
  const [isLoad, setLoad] = useState("false")
  const handleLoad = (newValue)=>{
    console.log(newValue)
    setLoad(newValue != null ? "true" : "false")
  }

  const spiner = {
    false: {display:"flex", opacity:1},
    true: {display:"none", opacity:0}
  }
  return (
    <div className={` ${
      isLoad == "true" ? "h-[600vh]":"h-[100vh] overflow-hidden"
    }`}>
      <motion.div animate={isLoad} variants={spiner} className='absolute bottom-10 right-10 z-20'>
        <div className='bg-[#1d1c1c] p-8 rounded-[30px] flex justify-center flex-col text-white'>
          <div className='w-full flex justify-center'>
            <motion.div animate={{rotate:360}} transition={{repeat:Infinity, duration:1, ease:"linear"}} className='inline-flex w-min'>
              <LoaderCircle width={"40px"} height={"40px"}/>
            </motion.div>
          </div>
          <p className='text-[14px] font-Poppins font-bold mt-4'>Loading..</p>
          <p className='text-[12px] font-Poppins font-normal'>Ładujemy modele 3D</p>
        </div>
      </motion.div>
      <header className='h-[100vh] w-full bg-[#1d1c1c]'>
        <Hero isLoad={isLoad}/>
      </header>
      <main className='bg-[#1d1c1c] sticky top-0'>
        <Container_3D handleLoad={handleLoad}/>
      </main>
      
    </div>
  );
}

export default App;
