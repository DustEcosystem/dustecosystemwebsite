// Components And Hooks
import Head from 'next/head';
import Navbar from "./Navbar"
import Footer from "./Footer"

const Layout = ({ children, title = 'Dust Ecosystem', showSubmitProjectBtn = true, showFooter = true, showUpcomingBtn = true }) => {
    return (
        <div className="debackground min-h-screen overflow-auto">
            <Head>
                <title>{title} | Dust Ecosystem</title>
                <meta name="description" content="Dustecosystem, $DUST, a useless token that everyone on Solana uses" />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:image" content="https://i.imgur.com/LVsJYp8.jpeg" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="$DUST, a useless token that everyone on Solana uses" />
                <meta property="og:url" content="https://www.dustecosystem.xyz/" />
                <meta property="og:site_name" content="DustEcosystem" />
                <meta property="og:title" content="DustEcosystem" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@DeGodsNFT" />
                <meta name="twitter:title" content="DustEcosystem" />
                <meta name="twitter:description" content="$DUST, a useless token that everyone on Solana uses" />
                <meta name="twitter:image" content="https://i.imgur.com/LVsJYp8.jpeg" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="w-full max-w-[1600px] mx-auto min-h-screen">
                <Navbar showSubmitProjectBtn={showSubmitProjectBtn} showUpcomingBtn={showUpcomingBtn} />
                <div className="min-h-[calc(100vh_-_216px)] sm:min-h-[calc(100vh_-_190px)] md:min-h-[calc(100vh_-_192px)] lg:min-h-[calc(100vh_-_216px)]">
                    {children}
                </div>
                <Footer showFooter={showFooter}/>
            </div>
        </div>
    )
}

export default Layout