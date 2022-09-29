// components and Hooks
import Link from 'next/link'
import Confetti from 'react-confetti'
import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import Layout from "../../components/Layout";

// Icons
import {CheckCircleIcon, ArrowDownRightIcon} from "@heroicons/react/24/solid"

function useWindowSize (){
    const [windowSize, setWindowSize] = useState({width: undefined, height: undefined});
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
      
        window.addEventListener("resize", handleResize);
       
        handleResize();
      
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

const Success = () => {
    const router = useRouter()
    const { width, height } = useWindowSize()
    const { projectName, slug } = router.query

    return (
        <Layout showSubmitProjectBtn={false} showFooter={false} title={"Success"}>
            <Confetti
                width={width}
                height={height}
                className="h-screen w-screen"
                tweenDuration={100}
            />
            <div className="flex flex-col justify-center items-center min-h-[35rem] md:min-h-[30rem] px-5 gap-5">
                <CheckCircleIcon className="h-20 w-20 text-[#90B578]"/>
                <h4 className="text-white text-4xl leading-[110%] -tracking-[1px] font-bold md:w-[50%] text-center selectionColor">Congrats, you submitted {projectName} to the Dust ecosystem. Our team will review your submission soon.</h4>
                <Link href={`/${slug}`} target="blank">
                    <a
                        className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-2.5 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 text-base md:text-lg cursor-pointer"
                    >
                        <p>See your Project Page</p>
                        <ArrowDownRightIcon className="h-5 w-5 text-white" />
                    </a>
                </Link>
            </div>
        </Layout>
    )
}

export default Success