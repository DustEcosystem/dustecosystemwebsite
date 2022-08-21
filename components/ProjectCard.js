import Image from "next/image";
import Link from "next/link"
import Badge from "./Badge"

const ProjectCard = ({projectInfo}) => {
    return (
        <Link 
            href={{
                pathname:"/[id]"
            }} 
            as={`/${projectInfo.id}`}
        >
            <div className="relative cursor-pointer max-w-[323px] p-4 bg-[#242424] rounded-xl transition ease-in-out shadowAndTransition">
                <div className="flex flex-col justify-center items-center rounded-xl relative w-64 max-w-full">
                    <div className="rounded-xl overflow-hidden w-60 h-60">
                        <Image 
                            src={projectInfo.image}
                            width={240}
                            height={240}
                        />
                    </div>
                    <div className="flex flex-col p-2 w-full gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="pt-3 text-white fontFamily text-xl font-extrabold selectionColor">
                                {projectInfo.title}
                            </div>
                            <div className="text-white text-sm selectionColor">
                                {`${projectInfo.description.slice(0,100)}....`}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {projectInfo.categories.map((category,key) =>{
                                return (
                                    <Badge key={key} category={category}/>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard;