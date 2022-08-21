import Layout from "../components/Layout";
import Image from "next/image";
import TwitterLogo from "../public/twitter.svg"
import Badge from "../components/Badge";
import projectList from "../db/ProjectList"

export async function getServerSideProps(context) {
    let projectData = projectList.filter((item) => item.id.toLowerCase()===context.query.id.toLowerCase())
    if(projectData.length <= 0){
        return {
            notFound: true
        }
    }
    return {
        props: {
            projectData: projectData[0]
        }
    }
}

const ProjectPage = ({projectData}) => {
    return (
        <Layout>
            <div className="flex py-5 px-4 sm:px-8 lg:px-12 xl:px-36 justify-between items-center text-white">
                <div className="flex flex-col items-center md:items-start md:flex-row gap-8">
                    <div className="w-60 h-60 rounded-xl overflow-hidden">
                        <Image 
                            src={projectData.image}
                            alt={`${projectData.title}`}
                            width={240}
                            height={240}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-6">
                        <h1 className="text-3xl font-bold text-white selectionColor fontFamily mt-1 text-center md:text-left">
                            {projectData.title}
                        </h1>
                        <div className="flex gap-3">
                            <a 
                                href={`${projectData.twitter}`}
                                target="blank"
                            >
                                <div className="flex justify-center items-center gap-1 text-white bg-[#009BEF] py-1 px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(0,155,239,0.5)] transition ease-in-out hover:-translate-y-1 duration-300">
                                    <Image 
                                        src={TwitterLogo}
                                        alt="Twitter logo"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-lg selectionColor">Twitter</p>  
                                </div>
                            </a>
                            {
                                projectData.discord && (
                                    <a 
                                        href={`${projectData.discord}`}
                                        target="blank"
                                    >
                                        <div className="flex justify-center items-center gap-1 text-white bg-[#5B66F6] py-1 px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(91,102,246,0.5)] transition ease-in-out hover:-translate-y-1 duration-300">
                                            <Image 
                                                src={TwitterLogo}
                                                alt="Twitter logo"
                                                width={16}
                                                height={16}
                                            />
                                            <p className="text-lg selectionColor">Discord</p>  
                                        </div>
                                    </a>
                                )
                            }
                            <a 
                                href={`${projectData.link}`}
                                target="blank"
                            >
                                <div className="flex justify-center items-center gap-1 text-white bg-[#242424] py-1 px-4 rounded-full hover:shadow-[3.0px_3.0px_rgba(255,255,255,0.2)] transition ease-in-out hover:-translate-y-1 duration-300">
                                    <p className="text-lg selectionColor">Try It</p>  
                                </div>
                            </a>
                        </div>
                        <div className="md:py-4">
                            <p className="text-xl selectionColor">
                                {projectData.description}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {projectData.categories.map((category,key) =>{
                                return (
                                    <Badge key={key} category={category}/>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProjectPage