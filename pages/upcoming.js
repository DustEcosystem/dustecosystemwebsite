// Components And Hooks
import { useState, useEffect } from "react";
import Layout from "../components/Layout"
import ProjectCard from "../components/ProjectCard";
import Loading from "../components/Loading";

// Firebase Database
import { db } from "../firebase";
import { onSnapshot, collection, query, where } from "@firebase/firestore";

const Upcoming = () => {
    const [projectsDatabase, setProjectsDatabase] = useState()

    // useEffect(() => (
    //     onSnapshot(
    //         query(collection(db, "projectsDatabase"),where("status","==","Building")),
    //         (snapshot) => {
    //             setProjectsDatabase(snapshot.docs);
    //         }
    //     )
    // ),[db])

    return (
        <Layout title={"Upcoming"} showUpcomingBtn={false} >
            <div className='py-5 px-4 sm:px-8 lg:px-12 xl:px-36'>
                <h1 className="text-5xl text-white fontFamily pb-3 selectionColor">Discover the upcoming projects</h1>
                <div className="border-t border-white w-full pb-9"></div>
                <div className="flex flex-wrap justify-center gap-6">
                    {projectsDatabase ? (
                        projectsDatabase.map((project) => (
                            <ProjectCard projectInfo={project.data()} key={project.id} id={project.id} />
                        ))
                    ):(
                        <Loading />
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Upcoming