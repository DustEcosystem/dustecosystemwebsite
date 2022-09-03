import Image from 'next/image'
import TwitterLogo from "../public/twitter.svg"
import { useRouter } from "next/router";

const Navbar = ({showApplyBtn}) => {
    const router = useRouter();

    return (
        <div className="flex py-5 px-4 sm:px-8 lg:px-12 xl:px-36 justify-between items-center">
            <a href="https://www.dustecosystem.xyz/">
                <div className="flex flex-col">
                    <div className="text-3xl md:text-5xl font-[Bely] font-bold leading-[1.2] mb-2 text-white selectionColor">
                        Dust Ecosystem
                    </div>
                    <div className="hidden lg:block fontFamily text-sm md:text-base text-white selectionColor">
                        $DUST, a useless token that everyone on Solana uses.
                    </div>
                </div>
            </a>
            <div className="flex gap-5 items-center">
                {showApplyBtn ? (
                    <button 
                        className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-2 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300"
                        onClick={() => router.push(`/apply`)}
                    >
                        <p className="text-lg selectionColor">Apply</p> 
                    </button>
                ) : ""}
                <div className="flex justify-center items-center mt-2">
                    <div className="transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300">
                        <a href="https://twitter.com/DustEcosystem" target="blank">
                            <Image 
                            src={TwitterLogo}
                            width={40}
                            height={40}
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar