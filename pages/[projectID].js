// components and react hooks
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import Moment from "react-moment";
import Layout from "../components/Layout";
import Badge from "../components/Badge";

// firebase database
import { db } from "../firebase";
import { 
    collection, 
    query, 
    onSnapshot, 
    where, 
    getDocs, 
    deleteDoc,
    setDoc, 
    updateDoc, 
    doc, 
    limit
} from "firebase/firestore";

// Icons
import TwitterLogo from "../public/twitter.svg"
import DiscordLogo from "../public/discord.svg"
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon, HandThumbDownIcon, PencilSquareIcon, ShareIcon} from "@heroicons/react/24/solid"

// convert seconds to date
const dateFromSecond = (seconds) => {
    let date =  new Date(null)
    date.setTime(seconds * 1000)
    return date
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export async function getStaticProps({params}) {
    const docRef = collection(db, "projectsDatabase")
    const querySnapshot = await getDocs(query(docRef, where("projectID", "==", params.projectID),limit(1)))
    let projectData = []
    querySnapshot.forEach((doc) => {
        projectData.push({...doc.data(), databaseId: doc.id})
    });
    if(projectData.length === 0) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            projectDataStr: JSON.stringify(projectData[0])
        },
        revalidate: 50,
    }
}

const ProjectPage = ({projectDataStr}) => {
    const [projectData] = useState(JSON.parse(projectDataStr))
    const [votesCount, setVotesCount] = useState(0)
    const [upvotes, setUpvotes] = useState([]);
    const [upvoted, setUpvoted] = useState(false);
    const  {data: session} = useSession();

    useEffect(() => (
        onSnapshot(collection(db, "projectsDatabase", projectData.databaseId, "upvotes"), (snapshot) => {
            setUpvotes(snapshot.docs)
            setVotesCount(snapshot.docs.length)
        })
    )[db, projectData.databaseId])

    useEffect(() => (
        setUpvoted(
            upvotes.findIndex((upvote) => upvote.id === session?.user?.id_str) !== -1
        )
    ),[upvotes])

    const upvoteProject = async () => {
        if(upvoted) {
            await deleteDoc(doc(db, "projectsDatabase", projectData.databaseId, "upvotes", session.user.id_str))
            await updateDoc(doc(db,"projectsDatabase",projectData.databaseId),{
                votesCount: votesCount - 1,
            })
        }  else {
            await setDoc(doc(db, "projectsDatabase", projectData.databaseId, "upvotes", session.user.id_str), {
              username: session.user.screen_name,
            })
            await updateDoc(doc(db,"projectsDatabase",projectData.databaseId),{
                votesCount: votesCount + 1,
            })
        }
    }
    
    return (
        <Layout showSubmitProjectBtn={false} title={`${projectData.projectName.charAt(0).toUpperCase() + projectData.projectName.slice(1)}`}>
            <div className="flex flex-col py-5 px-4 sm:px-8 lg:px-12 xl:px-36 justify-center items-center text-white">
                <div className="flex flex-col items-center md:items-start md:flex-row gap-8">
                    <div className="w-48 h-48 rounded-xl overflow-hidden order-1 md:order-1">
                        <Image 
                            src={projectData.projectLogo}
                            alt={`${projectData.projectName} | Dust Ecosystem`}
                            width={192}
                            height={192}
                        />
                    </div>
                    <div className="flex flex-col flex-1 order-3 md:order-2">
                        <div className="flex flex-col my-4 order-1">
                            <h1 className="text-3xl font-bold text-white selectionColor fontFamily mt-1 text-center md:text-left mb-2">
                                {projectData.projectName}
                            </h1>
                            <p className="text-xl selectionColor text-center md:text-left">
                                {projectData.description}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 my-4 justify-center md:justify-start order-2">
                            <a 
                                href={`${projectData.twitterURL}`}
                                target="blank"
                            >
                                <div className="flex justify-center items-center gap-1 text-white bg-[#009BEF] py-1 px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(0,155,239,0.5)] transition ease-in-out hover:-translate-y-1 duration-300">
                                    <Image 
                                        src={TwitterLogo}
                                        alt="Twitter logo | Dust Ecosystem"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-lg selectionColor">Twitter</p>  
                                </div>
                            </a>
                            {
                                projectData.discordURL && (
                                    <a 
                                        href={`${projectData.discordURL}`}
                                        target="blank"
                                    >
                                        <div className="flex justify-center items-center gap-1 text-white bg-[#5B66F6] py-1 px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(91,102,246,0.5)] transition ease-in-out hover:-translate-y-1 duration-300">
                                            <Image 
                                                src={DiscordLogo}
                                                alt="Discord Logo | Dust Ecosystem"
                                                width={17}
                                                height={17}
                                            />
                                            <p className="text-lg selectionColor">Discord</p>  
                                        </div>
                                    </a>
                                )
                            }
                            {
                                projectData.magicedenURL && (
                                    <a 
                                        href={`${projectData.magicedenURL}`}
                                        target="blank"
                                    >
                                        <div className="flex justify-center items-center gap-1 text-white bg-[#E42575] py-1 px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(228,37,117,0.5)] transition ease-in-out hover:-translate-y-1 duration-300">
                                            <p className="text-lg selectionColor">Magic Eden</p>  
                                        </div>
                                    </a>
                                )
                            }
                            <a 
                                href={`${projectData.websiteLink}`}
                                target="blank"
                            >
                                <div className="flex justify-center items-center gap-1 text-white bg-[#242424] py-1 px-4 rounded-full hover:shadow-[3.0px_3.0px_rgba(255,255,255,0.2)] transition ease-in-out hover:-translate-y-1 duration-300">
                                    <p className="text-lg selectionColor">Try It</p>  
                                </div>
                            </a>
                        </div>
                        <div className="flex justify-center my-4 order-3">
                            <div className="relative w-full">
                                <img
                                    src={projectData.screenshot}
                                    alt={`${projectData.projectName} | Dust Ecosystem`}
                                    className="rounded-2xl max-h-80 object-contain"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col my-4 order-4">
                            <h1 className="text-2xl font-bold text-white selectionColor fontFamily mb-1">
                                $DUST Usage Information
                            </h1>
                            <p className="text-lg selectionColor">
                                {projectData.dustUsageDescription}
                            </p>
                        </div>
                        <div className="flex flex-col my-4 gap-2 order-6 md:order-5">
                            <div className="text-sm uppercase md:hidden">
                                Category
                            </div>
                            <div className="flex gap-3">
                                {projectData.categories && projectData.categories.map((category,key) =>{
                                    return (
                                        <Badge key={key} category={category}/>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="mt-4 order-5 md:order-6">
                            <div className="flex items-center gap-7">
                                <div className="flex gap-2 items-center selectionColor">
                                    <CalendarDaysIcon className="h-5 w-5" />
                                    <Moment format="D MMM YYYY" withTitle>{dateFromSecond(projectData.timestamp.seconds)}</Moment>
                                </div>
                                <Link
                                    href={`https://twitter.com/intent/tweet?text=${`Check @${projectData.twitterURL.split("/").slice(-1)[0]} on @DustEcosystem! %0A%0A`}&url=https://dustecosystem.xyz/${projectData.projectID} %0A%0A&hashtags=Degods,Dustecosystem,Solana`}
                                >
                                    <a className="flex gap-2 items-center cursor-pointer text-[#90B578]"
                                        target="blank"
                                    >
                                        <ShareIcon className="h-4 w-4" />
                                        <p>Share</p>
                                    </a>
                                </Link>
                            </div>
                            <div className="border-t border-white w-full my-4 md:hidden"></div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:w-[200px] order-2 md:order-3 gap-5">
                        {session ? (     
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    upvoteProject();
                                }}
                                className="flex justify-center items-center text-white bg-[#90B578] py-2.5 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 w-full fontFamily"
                            >
                                {upvoted ? (
                                    <HandThumbDownIcon className="h-8 w-8" />
                                ): (
                                    <HandThumbUpIcon className="h-8 w-8" />
                                )}
                                <p className="text-base md:text-lg uppercase mx-2">Upvote {votesCount > 0 && `${votesCount}`}</p> 
                            </button>
                        ) : (
                            <button
                                onClick={() => window.open(`${window.location.origin}/auth/signin`,"popup", "width=350, height=350, left=600,top=250")}
                                className="flex justify-center items-center text-white bg-[#90B578] py-2.5 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 w-full fontFamily"
                            >
                                <HandThumbUpIcon className="h-7 w-7" />
                                <p className="text-base md:text-lg uppercase mx-2">Upvote {votesCount > 0 && `${votesCount}`}</p> 
                            </button>
                        )}
                        <Link
                            href={{
                                pathname:"/edit/[projectID]",
                            }} 
                            as={`/edit/${projectData.projectID}`}
                        >
                            <button className="flex gap-2 justify-center items-center hover:text-[#90B578] cursor-pointer py-2.5 px-5">
                                <PencilSquareIcon className="h-7 w-7" />
                                Edit Information
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProjectPage