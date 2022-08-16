import Image from 'next/image'
import TwitterLogo from "../public/twitter.svg"

const Navbar = () => {
    return (
        <div className="flex py-2 px-3 md:px-24 justify-between items-center">
            <div className="flex flex-col">
                <div className="text-3xl md:text-5xl font-[Bely] font-bold leading-[1.2] mb-2 text-white">
                    Dust Ecosystem
                </div>
                <div className="fontFamily text-sm md:text-base text-white">
                    $DUST, a useless token that everyone on Solana uses.
                </div>
                </div>
            <div>
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
    )
}

export default Navbar