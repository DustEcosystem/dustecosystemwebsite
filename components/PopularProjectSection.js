// Components And Hooks
import Link from "next/link";
import { useEffect, useState } from "react";
import ProjectPlaceholder from "./ProjectPlaceholder";

// Firebase Database
import { db } from "../firebase";
import { onSnapshot, collection, query, where , orderBy, limit} from "@firebase/firestore";
import Loading from "./Loading";

const PopularProjectSection = () => {
    const [projectsDatabase, setProjectsDatabase] = useState()

    useEffect(() => ( 
        onSnapshot(
            query(collection(db, "projectsDatabase"),where("status","==","Live"), orderBy("votesCount","desc"),limit(6)),
            (snapshot) => {
                setProjectsDatabase(snapshot.docs);
            }
        )
    ),[db]);

    return (
        <div className="py-5 px-4 sm:px-8 lg:px-12 xl:px-36">
            <div className="flex justify-between pt-6 pb-3">
                <h1 className="text-3xl md:text-4xl text-white fontFamily selectionColor">Popular</h1>
                <Link
                    href="/popular"
                >
                    <a 
                        className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-2 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 cursor-pointer"
                    >
                        <p className="text-lg selectionColor">Show more</p> 
                    </a>
                </Link>
            </div>
            <div className="border-t border-white w-full pb-6"></div>
            <div className="flex flex-wrap justify-around gap-3">
                {projectsDatabase ? (
                    projectsDatabase.map((project) => (    
                        <ProjectPlaceholder projectInfo={project.data()} key={project.id} id={project.id} />
                    ))
                ):(
                    <Loading height={"30vh"} />
                )}
            </div>
        </div>
    )
}

export default PopularProjectSection;