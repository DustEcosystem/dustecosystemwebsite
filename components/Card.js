// Components And Hooks
import Image from "next/image"
import Link from "next/link"
import { useState,useEffect } from "react"
import { useSession } from "next-auth/react";
import Badge from "./Badge"

// Firebase Database
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, setDoc, updateDoc , doc } from "firebase/firestore";

// Icons
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid"

const Card = ({projectInfo, id}) => {
    const [votesCount, setVotesCount] = useState(0)
    const [upvotes, setUpvotes] = useState([]);
    const [upvoted, setUpvoted] = useState(false);
    const  {data: session} = useSession();

    useEffect(() => (
        onSnapshot(collection(db, "projectsDatabase", id, "upvotes"), (snapshot) => {
            setUpvotes(snapshot.docs)
            setVotesCount(snapshot.docs.length)
        })
    )[db, id])

    useEffect(() => (
        setUpvoted(
            upvotes.findIndex((upvote) => upvote.id === session?.user?.id_str) !== -1
        )
    ),[upvotes])

    const upvoteProject = async () => {
        if(upvoted) {
            await deleteDoc(doc(db, "projectsDatabase", id, "upvotes", session.user.id_str))
            await updateDoc(doc(db,"projectsDatabase",id),{
                votesCount: votesCount - 1,
            })
        }  else {
            await setDoc(doc(db, "projectsDatabase", id, "upvotes", session.user.id_str), {
              username: session.user.screen_name,
            })
            await updateDoc(doc(db,"projectsDatabase",id),{
                votesCount: votesCount + 1,
            })
        }
    }

    return (
        <Link
            href={{
                pathname:"/[projectID]",
            }} 
            as={`/${projectInfo.projectID}`}
        >
            <div className="flex flex-auto p-2 md:p-4 bg-[#242424]/40 border-b border-white/50 cursor-pointer hover:bg-[#242424]">
                <div className="rounded-xl overflow-hidden w-16 h-16 md:w-32 md:h-32 my-auto">
                    <Image 
                        src={projectInfo.projectLogo}
                        width={128}
                        height={128}
                        alt={`${projectInfo.projectName} | Dust Ecosystem`}
                    />
                </div>
                <div className="flex flex-col flex-1 justify-between my-2 mx-2 md:mx-8">
                    <div>
                        <div className="mb-1 text-xl text-white">{projectInfo.projectName}</div>
                        <div className="font-light text-lg overflow-hidden text-white/50">
                            {`${projectInfo.description.slice(0,100)}....`}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {projectInfo.categories.map((category,key) =>{
                            return (
                                <Badge key={key} category={category}/>
                            )
                        })}
                    </div>
                </div>
                {session ? (
                    <div 
                        className={`flex flex-col my-auto justify-center py-1 px-1.5 border-l items-center  md:rounded-xl md:w-28 md:h-28 md:border ${upvoted ? "border-[#90B578] text-[#90B578]":"text-white border-white"}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            upvoteProject();
                        }}
                    >
                        {upvoted ? (
                            <HandThumbDownIcon className="h-8 w-8" />
                        ): (
                            <HandThumbUpIcon className="h-8 w-8" />
                        )}
                        <div>
                            {projectInfo.votesCount}
                        </div>
                    </div>
                ) : (
                    <div 
                        className="flex flex-col my-auto justify-center py-1 px-1.5 border-l items-center text-white md:rounded-xl md:w-28    md:h-28 md:border border-white"
                        onClick={(e) => {
                            e.stopPropagation()
                            window.open(`${window.location.origin}/auth/signin`,"popup", "width=350, height=350, left=600,top=250")
                        }}
                    >
                        <HandThumbUpIcon className="h-7 w-7" />
                        <div>
                            {projectInfo.votesCount}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default Card