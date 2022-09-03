import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/login";
import {signOut} from "next-auth/react"
import Layout from "../components/Layout";
import TwitterLogo from "../public/twitter.svg"
import Image from "next/image";
import FamousFox from "../public/famousfox.jpg"
import {useForm} from "react-hook-form"

const apply = ({providers}) => {
    const  {data: session} = useSession();
    const {watch} = useForm()

    if(!session) return  <Login providers={providers} />

    return (
        <Layout showApplyBtn={false}>
            <div className="flex flex-col px-4 sm:px-8 lg:px-28 xl:px-52 text-white gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-3xl text-[#90B578] fontFamily selectionColor">Apply for New Project</h2>
                    <button
                        className="flex justify-center items-center gap-1 text-white bg-[#009BEF] py-1 px-2 md:py-1 md:px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(0,155,239,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 "
                        onClick={signOut}
                    >
                        <Image 
                            src={TwitterLogo}
                            alt="Twitter logo"
                            width={16}
                            height={16}
                        />  
                        <p className="text-base md:text-lg">Sign Out</p> 
                    </button>
                </div>
                <div className="flex flex-col items-center md:items-start md:flex-row gap-8 justify-center">
                    <div className="w-60 h-60 rounded-xl overflow-hidden">
                        <Image 
                            src={FamousFox}
                            alt={`Famout foxs`}
                            width={240}
                            height={240}
                        />
                    </div>
                    <div className="w-full md:w-2/3 bg-[#242424] rounded-2xl p-8 md:mt-0 transition">
                        <form className="flex flex-col gap-4">
                            <h2 className="font-semibold text-3xl">
                                Project / Product Information
                            </h2>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="username" className="text-lg fontFamily">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    className="text-input text-lg py-1 px-3 rounded-lg"
                                    placeholder="username"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="username" className="text-lg fontFamily">
                                    Description
                                </label>
                                <textarea
                                    type="text"
                                    rows={2}
                                    name="username"
                                    className="text-input text-lg py-1 px-3 rounded-lg w-full min-h-[80px]"
                                    placeholder="Description about Project / Product"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="username" className="text-lg">
                                    Twitter Link
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="text-input text-lg py-1 px-3 rounded-lg"
                                    placeholder="username"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="username" className="text-lg">
                                    Discord Link
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="text-input text-lg py-1 px-3 rounded-lg"
                                    placeholder="username"
                                />
                            </div>
                            <div>
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default apply

export async function getServerSideProps(context) {
    const providers = await getProviders();
    const session = await getSession(context);

    // here you must return the session
    return {
        props: {
            providers,
            session,
        },
    };
}