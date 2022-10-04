// Components And Hooks
import Image from "next/image";
import Link from "next/link"

const ProjectPlaceholder = ({ projectInfo }) => {
    return (
        <Link
            href={{
                pathname:"/[projectID]",
            }} 
            as={`/${projectInfo.projectID}`}
        >
            <div className="relative flex flex-col items-center cursor-pointer max-w-[140px] rounded-xl transition ease-in-out shadowAndTransition hover:shadow-none">
                <div className="rounded-xl overflow-hidden w-[140px] h-[140px]">
                    <Image 
                        src={projectInfo.projectLogo}
                        width={140}
                        height={140}
                        alt={`${projectInfo.projectName} | Dust Ecosystem`}
                    />
                </div>
                <div className="pt-3 text-white fontFamily text-base text-center font-extrabold selectionColor">
                    {`${projectInfo.projectName.length > 14 ? `${projectInfo.projectName.slice(0,12)}...`: projectInfo.projectName}`}
                </div>
            </div>
        </Link>
    )
}

export default ProjectPlaceholder