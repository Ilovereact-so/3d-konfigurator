import React, { useEffect, useRef, useState } from 'react'
import { motion,  animate, useScroll, useTransform } from 'framer-motion'
import { MoveDown } from 'lucide-react'

const Hero = ({isLoad}) => {
    const targetRef = useRef(null)
    const [isUseMouse, SetUseMouse] = useState(true)
    useEffect(()=>{
        targetRef.current.style.setProperty("--color",'#CF2626')

        const updateMousePosition = (event)=>{
        if(!targetRef.current) return;
        const { clientX, clientY } = event;
        targetRef.current.style.setProperty("--x", `${clientX}px`);
        targetRef.current.style.setProperty("--y", `${clientY}px`);
        }

        if(isUseMouse){
        window.addEventListener("mousemove", updateMousePosition);
        }else{
        window.removeEventListener("mousemove", updateMousePosition);
        }

        return () => {
        window.removeEventListener("mousemove", updateMousePosition);
        };
    },[isUseMouse])

    const header = useRef(null)
    const min = 0.1;
    const max = 0.8;
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["end end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    const handleClick = () => {
        const scrollTarget = document.body.scrollHeight // scroll to bottom
        animate(window.scrollY, scrollTarget, {
        duration: 10,
        ease: "easeInOut",
        onUpdate: (value) => window.scrollTo(0, value),
        })
    }

    return (
        <motion.section
        ref={targetRef}
        style={{opacity}}
        className="relative mb-[8rem] h-screen py-16 ease-in-out duration-300 text-white before:pointer-events-none before:fixed before:inset-0 before:z-0 before:bg-[radial-gradient(circle_farthest-side_at_var(--x,_100px)_var(--y,_100px),_var(--color)_0%,_transparent_100%)] before:opacity-100 "
        >
            <motion.div style={{scale}} className='fixed top-0 w-full h-[100vh] flex font-Poppins text-white mt-[20vh] items-center z-10 flex-col origin-top '>
                <p className='text-[clamp(35px,3vw,61px)] font-bold'>Developer Room</p>
                <div className='w-[90vw] h-full absolute mm:top-[-30px] top-[-17vh] left-[50%] translate-x-[-50%]'>
                    <h1 id='vtext' className='whitespace-nowrap opacity-40 mm:text-[clamp(40px,10vw,220px)] text-[clamp(40px,8vh,100px)] text-[#181717] font-bold font-Poppins z-0 text-center'>Konfigurator 3D</h1>
                </div>
                <p className='relative z-10 text-[clamp(17px,2vw,20px)]'>Prezentacja wlaściwości stron</p>
                <div onClick={ isLoad == "true" ? handleClick : null} id='scrollBTN' className='px-4 py-3 bg-white cursor-pointer text-black text-[17px] font-bold rounded-full mt-5 duration-300 ease-out relative overflow-hidden hover:invert-[0.9]' >
                    <p>Scroll</p>
                    <i className='absolute top-0 left-[50%] translate-x-[-50%]'><MoveDown/></i>
                </div>
            </motion.div>
        </motion.section>

    )
}

export default Hero