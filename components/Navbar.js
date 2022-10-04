// Components And Hooks
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react"
import MenuComponent from '../components/MenuComponent';

// Icons
import TwitterLogo from "../public/twitter.svg"
import {Bars3Icon,XMarkIcon} from "@heroicons/react/24/outline"

const NavBar = ({showSubmitProjectBtn = true, showUpcomingBtn = true }) => {
    const [navbar, setNavbar] = useState(false);
    const  {data: session} = useSession();

    return (
        <nav className="w-full debackground text-white shadow">
            <div className="justify-between py-5 px-4 mx-auto md:mx-0 md:items-center md:flex sm:px-8 lg:px-12 xl:px-36 items-center">
                <div>
                    <div className="flex items-center justify-between md:block">
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
                        <div className="md:hidden">
                            <button
                                className="p-2 text-gray-700 rounded-md outline-none"
                                onClick={() => setNavbar(!navbar)}
                            >
                                {navbar ? (
                                    <XMarkIcon className="md:hidden h-10 w-10 text-white" />
                                ) : (
                                    <Bars3Icon className="md:hidden h-10 w-10 text-white" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                            navbar ? "block" : "hidden"
                        }`}
                    >
                        <div className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                            {showUpcomingBtn ? (
                                <Link href="/upcoming">
                                <a 
                                    className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-2 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300"
                                    target="blank"
                                >
                                    <p className="text-lg selectionColor">Upcoming</p> 
                                </a>
                            </Link>
                            ):""}
                            {showSubmitProjectBtn ? (
                                <Link href="/submit-project">
                                    <a 
                                        className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-2 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300"
                                        target="blank"
                                    >
                                        <p className="text-lg selectionColor">Submit Project</p> 
                                    </a>
                                </Link>
                            ):""}
                            <div className="flex justify-center items-center mt-2">
                                <div className="transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300">
                                    <a href="https://twitter.com/DustEcosystem" target="blank" className="flex">
                                        <Image 
                                            src={TwitterLogo}
                                            width={40}
                                            height={40}
                                            alt="Twitter Logo | Dust Ecosystem"
                                        />
                                    </a>
                                </div>
                            </div>
                            {session && (
                                <MenuComponent />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;