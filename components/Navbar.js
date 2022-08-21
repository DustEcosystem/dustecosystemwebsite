import Image from 'next/image'
import TwitterLogo from "../public/twitter.svg"

const Navbar = () => {
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
            <div>
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