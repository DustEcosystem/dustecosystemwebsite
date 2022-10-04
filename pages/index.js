import Statistics from '../components/Statistics'
import Layout from "../components/Layout"
import ProjectSection from '../components/ProjectsSection'
import PopularProjectSection from "../components/PopularProjectSection"

export async function getServerSideProps(context) {
    let resDustPrice = await fetch('https://price.jup.ag/v1/price?id=DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ&vsToken=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    resDustPrice = await resDustPrice.json()
    return {
        props: {
            dustPrice: JSON.stringify(resDustPrice.data.price).slice(0,4),
        }
    }
}

export default function Home({dustPrice}) {
    return (
        <Layout title={"Home"}>
            <Statistics dustPrice={dustPrice} />
            <PopularProjectSection />
            <ProjectSection />
        </Layout>
    )
}
