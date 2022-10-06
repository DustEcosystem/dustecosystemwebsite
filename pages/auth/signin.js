// Components And Hooks
import Image from "next/image";
import Head from 'next/head';
import { useRouter } from 'next/router'
import { signIn } from "next-auth/react"
import { getProviders, getSession, useSession } from "next-auth/react";

// Icons
import TwitterLogo from "../../public/twitter.svg"

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

const SignInPage = ({providers}) => {
    const router = useRouter()
    const { projectID } = router.query
    const  {data: session} = useSession();

    if(session && typeof window !== 'undefined') {
        window.close()
        window.opener.location.reload()
    }

    return (
        <div>
            <Head>
                <title>Sign In | Dust Ecosystem</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="Dustecosystem, $DUST, a useless token that everyone on Solana uses" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="flex debackground justify-center items-center flex-col text-center h-screen p-5">
                <div>
                    {projectID}
                </div>
                {Object.values(providers).map(provider => (
                    <div key={provider.name}>
                        <button
                            className="flex justify-center items-center gap-3 text-white bg-[#009BEF] py-3 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(0,155,239,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 "
                            onClick={() => {
                                signIn(provider.id)
                            }}
                        >
                            <Image 
                                src={TwitterLogo}
                                alt="Twitter logo | Dust Ecosystem"
                                width={30}
                                height={30}
                            />  
                            <p className="text-lg">Verify with Twitter</p> 
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SignInPage