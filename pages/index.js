import Statistics from "../components/Statistics";
import Layout from "../components/Layout";
import ProjectSection from "../components/ProjectsSection";
import PopularProjectSection from "../components/PopularProjectSection";

export async function getServerSideProps(context) {
  let resDustPrice = await fetch(
    "https://price.jup.ag/v4/price?ids=DUST&vsToken=USDT"
  );
  resDustPrice = await resDustPrice.json();
  console.log("dust Price");
  return {
    props: {
      dustPrice:
        JSON.stringify(resDustPrice?.data?.["DUST"]?.price).slice(0, 4) ?? "0",
    },
  };
}

export default function Home({ dustPrice }) {
  return (
    <Layout title={"Home"}>
      <Statistics dustPrice={dustPrice} />
      <PopularProjectSection />
      <ProjectSection />
    </Layout>
  );
}
