// Components And Hooks
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard"
import Loading from "./Loading";

// firebase Database
import { db } from "../firebase";
import { onSnapshot, collection, query, where } from "@firebase/firestore";


const ProjectSection = () => {
    const [projectsDatabase, setProjectsDatabase] = useState()

    useEffect(() => ( 
        onSnapshot(
            query(collection(db, "projectsDatabase"),where("status","==","Live")),
            (snapshot) => {
                setProjectsDatabase(snapshot.docs);
            }
        )
    ),[db]);

    return (
        <div className='py-5 px-4 sm:px-8 lg:px-12 xl:px-36'>
            <h1 className="text-3xl md:text-4xl text-white fontFamily pt-3 pb-3 selectionColor">Discover the hottest projects</h1>
            <div className="border-t border-white w-full pb-9"></div>
            <div className="flex flex-wrap justify-center gap-6">
                {projectsDatabase ? (
                    projectsDatabase.map((project) => (
                        <ProjectCard projectInfo={project.data()} key={project.id} id={project.id} />
                    ))
                ):(
                    <Loading height={"50vh"} />
                )}
            </div>
        </div>
    )
}

export default ProjectSection