import { useEffect, useState } from "react";
import Layout from "../components/Layout"
import Card from "../components/Card";
import Loading from "../components/Loading";

// firebase database
import { db } from "../firebase";
import { onSnapshot, collection, query, where ,orderBy } from "@firebase/firestore";


const Popular = () => {
    const [projectsDatabase, setProjectsDatabase] = useState()

    useEffect(() => ( 
        onSnapshot(
            query(collection(db, "projectsDatabase"),where("status","==","Live"), orderBy("votesCount","desc")),
            (snapshot) => {
                setProjectsDatabase(snapshot.docs);
            }
        )
    ),[db]);

    return  (
        <Layout title={"Popular"}>
            <div className="py-5 px-4 sm:px-8 lg:px-12 xl:px-36">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl pb-3 text-white fontFamily selectionColor">Popular Projects</h1>
                    <div className="border-t border-white w-full pb-6" />
                    <div className="flex flex-col rounded-xl overflow-hidden">
                        {projectsDatabase ? (projectsDatabase.map((project) => (
                            <Card projectInfo={project.data()} key={project.id} id={project.id} />
                        ))):(
                            <Loading height={"50vh"}/>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Popular