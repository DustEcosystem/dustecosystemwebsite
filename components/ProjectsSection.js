import FamousFox from "../public/famousfox.jpg"
import VandalCityImg from "../public/vandal_city.png"
import DebeanRoasterImg from "../public/debeansroaster.png"
import DegenPicksImg from "../public/degenpicks.png"
import DegodsDisplayImg from "../public/degodsdisplay.jpg"
import PsyOptionsImg from "../public/PsyOptions.png"
import VaultXImg from "../public/vaultx.jpg"
import ProjectCard from "./ProjectCard"
import projectList from "../db/ProjectList"

const ProjectSection = () => {
    return (
        <div className='py-5 px-4 sm:px-8 lg:px-12 xl:px-36'>
            <h1 className="text-5xl text-white fontFamily pt-6 pb-9 selectionColor">Discover the hottest projects</h1>
            <div className="flex flex-wrap justify-center gap-6">
                {projectList.map((project) => {
                    return (
                        <ProjectCard projectInfo={project} key={project.id}/>
                    )
                })}
            </div>
        </div>
    )
}

export default ProjectSection