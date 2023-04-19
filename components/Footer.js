const Footer = ({showFooter}) => {
    return  (
        <>
           {showFooter ? (
                <div className="py-5 px-4 sm:px-8 lg:px-12 xl:px-36">
                    <div className="text-center py-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff7c01] via-[#ff5301] to-[#a819eb] fontFamily">
                        Copyright © 2022. Made with ♥ by <a target="blank" href="https://twitter.com/s0rrymybad_" className="cursor-pointer underline">@s0rrymybad_</a>
                    </div>
                </div>
            ):""}
        </>
    )
}

export default Footer;
