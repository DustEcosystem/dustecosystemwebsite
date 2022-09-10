import Layout from "./Layout";
import {signIn} from "next-auth/react"
import TwitterLogo from "../public/twitter.svg"
import Image from "next/image";

const Login = ({providers}) => {
    return (
        <Layout showSubmitProjectBtn={false}>
            <div className="flex flex-col justify-center items-center min-h-[70vh]">
                {Object.values(providers).map(provider => (
                    <div key={provider.name}>
                        <button
                            className="flex justify-center items-center gap-3 text-white bg-[#009BEF] py-3 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(0,155,239,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 "
                            onClick={() => signIn(provider.id, {callbackUrl: "/submit-project"})}
                        >
                            <Image 
                                src={TwitterLogo}
                                alt="Twitter logo"
                                width={30}
                                height={30}
                            />  
                            <p className="text-lg">Verify with Twitter</p> 
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export default Login