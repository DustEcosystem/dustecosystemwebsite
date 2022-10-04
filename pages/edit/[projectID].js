// Components And React Hooks
import Image from "next/image";
import { useRouter } from 'next/router'
import { signOut } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useState, useRef } from "react";
import { getProviders, getSession, useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import Login from "../../components/login";
import ErrorPage from "../../components/ErrorPage";

// Firebase Database
import { db, storage } from "../../firebase";
import { collection, query, where, getDocs, serverTimestamp, doc, limit, updateDoc} from "firebase/firestore";
import { getDownloadURL, ref, uploadString, deleteObject } from "@firebase/storage";

// Icons
import TwitterLogo from "../../public/twitter.svg"
import { XMarkIcon,PlusCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { XMarkIcon as Cross } from "@heroicons/react/24/solid";

export async function getServerSideProps(context) {
    const providers = await getProviders();
    const session = await getSession(context);
    const docRef = collection(db, "projectsDatabase");
    const q = query(docRef, where("projectID", "==", context.params.projectID),limit(1));
    const querySnapshot = await getDocs(q);
    let projectData = []
    querySnapshot.forEach((doc) => {
        projectData.push({...doc.data(), databaseId: doc.id})
    });
    if(projectData.length === 0) {
        return {
            notFound: true,
        }
    }
    // here you must return the session
    return {
        props: {
            providers,
            session,
            projectDataStr: JSON.stringify(projectData[0])
        },
    };
}

// steps for project information
const steps = ["Image and Media","$DUST Info","Category","Socials"]

const Edit = ({projectDataStr, providers}) => {
    const projectData = JSON.parse(projectDataStr)
    const {data: session} = useSession()
    const { watch, register, formState: {errors, isValid}, setValue, getValues} = useForm({
        mode:"all",
        defaultValues: {
            "projectName": projectData.projectName,
            "websiteLink": projectData.websiteLink,
            "description": projectData.description,
            "dustUsageDescription": projectData.dustUsageDescription,
            "daoWallet": projectData.daoWallet,
            "status": projectData.status,
            "twitterURL": projectData.twitterURL,
            "discordURL":projectData.discordURL,
            "magicedenURL": projectData.magicedenURL
        }
    })
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState(projectData.categories)
    const filePickerRefOne = useRef(null);
    const filePickerRefOneTwo = useRef(null)
    const [selectedLogoFile, setselectedLogoFile] = useState(null);
    const [selectedPreviewFile, setselectedPreviewFile] = useState(null)
    const [currentStep, setCurrentStep] = useState(1)
    const router = useRouter()
     
    if(!session) return <Login providers={providers} callBackURL={`/edit/${projectData.projectID}`} />

    if(session && session.user.id !== projectData.authorTwitterId && session.user.screen_name !== projectData.twitterURL.split("/").slice(-1)[0]) {
        return <ErrorPage projectId={projectData.projectID} />
    }

    const addProjectLogo = (e) => {
        const reader = new FileReader();
        if(e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }
    
        reader.onload = (readerEvent) => {
            setselectedLogoFile(readerEvent.target.result)
        }
    }

    const addProjectPreview = (e) => {
        const reader = new FileReader();
        if(e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }
    
        reader.onload = (readerEvent) => {
            setselectedPreviewFile(readerEvent.target.result)
        }
    }

    const nextStep = () => {
        if(currentStep < 5) {
            setCurrentStep(oldValue => oldValue + 1)
        }
    }

    const previousStep = () => {
        setCurrentStep(oldValue => oldValue - 1)
    }

    const handleKeyDown = (e) => {
        if(e.key !== "Enter") return
        const value = e.target.value
        if(!value.trim()) return
        setCategories([...categories,value])
        e.target.value = ""
    }

    const removeCategory = (index) => {
        setCategories(categories.filter((category, i) => i !== index))
    }

    const deleteImageFromFirebase = (url) => {
        let pictureRef = ref(storage,url);
        deleteObject(pictureRef).then(() => {
            console.log("Deleted Successfully")
        }).catch((error) => {
            console.log(error)
        });
    };

    const handleSubmit = async () => {
        if(loading) return;
        setLoading(true)

        const projectInfo = getValues()

        const docRef = await doc(db,"projectsDatabase",projectData.databaseId)

        await updateDoc(docRef,{
            ...projectInfo,
            "id":projectInfo.projectName.replaceAll(" ","").toLowerCase(),
            "categories": categories,
            "authorTwitterUsername": session.user.screen_name,
            "authorTwitterId": session.user.id,
            "authorName": session.user.name,
            "projectID": projectInfo.projectName.replaceAll(" ","").toLowerCase(),
            timestamp: serverTimestamp(),
        })

        const imageRefLogo = ref(storage, `projectsDatabase/${docRef.id}/${projectInfo.projectName}L`);
        const imageRefScreenshot = ref(storage,`projectsDatabase/${docRef.id}/${projectInfo.projectName}S`)

        if(selectedLogoFile) {
            deleteImageFromFirebase(projectData.projectLogo)
            await uploadString(imageRefLogo, selectedLogoFile, "data_url").then(async () => {
                const downloadURL = await getDownloadURL(imageRefLogo)
                await updateDoc(doc(db,"projectsDatabase",docRef.id),{
                    projectLogo: downloadURL,
                })
            })
        }
        if(selectedPreviewFile) {
            deleteImageFromFirebase(projectData.screenshot)
            await uploadString(imageRefScreenshot, selectedPreviewFile,"data_url").then(async () =>{
                const downloadURL = await getDownloadURL(imageRefScreenshot)
                await updateDoc(doc(db,"projectsDatabase",docRef.id),{
                    screenshot: downloadURL,
                })
            })
        }
        
        setLoading(false)
        router.push(`/edit/success?projectName=${projectInfo.projectName.replaceAll(" ","+")}&slug=${projectInfo.projectName.replaceAll(" ","").toLowerCase()}`)
    }

    return (
        <Layout showSubmitProjectBtn={false} showFooter={false}>
            <div className="flex flex-col px-4 pb-16 sm:px-8 lg:px-28 xl:px-52 text-white gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-3xl text-[#90B578] fontFamily selectionColor">Edit Project Information</h2>
                    <button
                        className="flex justify-center items-center gap-1 text-white bg-[#009BEF] py-1 px-2 md:py-1 md:px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(0,155,239,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 "
                        onClick={signOut}
                    >
                        <Image 
                            src={TwitterLogo}
                            alt="Twitter Logo | Dust Ecosystem"
                            width={16}
                            height={16}
                        />  
                        <p className="text-base md:text-lg">Sign Out</p> 
                    </button>
                </div>
                <div className="flex flex-col items-center md:items-start md:flex-row gap-8 justify-center">
                    <div className="flex flex-col w-full md:w-8/12 rounded-2xl md:mt-0 gap-6 transition">
                        <div className="flex flex-col">
                            {currentStep === 1 && (
                                <>
                                    <h2 className="font-semibold text-3xl selectionColor pb-6">
                                        Project / Product Information
                                    </h2>
                                    <div className="input-container">
                                        <label htmlFor="projectName" className="text-lg fontFamily selectionColor">
                                            Project / Product Name
                                        </label>
                                        <input
                                            type="text"
                                            id="projectName"
                                            className={`input ${errors.projectName ? "border-2 border-[#ff5252]" : ""}`}
                                            placeholder="Project / Product Name"
                                            autoComplete="off"
                                            {...register("projectName",{
                                                required: {
                                                    value: true,
                                                    message: "Required",
                                                },
                                            })}
                                        />
                                        {errors.projectName && <p className="absolute left-0 -bottom-2 text-[#ff5252]">{errors.projectName.message}</p>}
                                    </div>
                                    <div className="input-container">
                                        <label htmlFor="websiteLink" className="text-lg fontFamily selectionColor">
                                            Website link
                                        </label>
                                        <input
                                            type="text"
                                            id="websiteLink"
                                            className={`input ${errors.websiteLink ? "border-2 border-[#ff5252]" : ""}`}
                                            placeholder="https://example.com"
                                            autoComplete="off"
                                            {...register("websiteLink",{
                                                required: {
                                                    value: true,
                                                    message: "Required",
                                                },
                                                pattern: {
                                                    value: /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/,
                                                    message: "Insert a valid URL",
                                                },
                                            })}
                                        />
                                        {errors.websiteLink && <p className="absolute left-0 -bottom-2 text-[#ff5252]">{errors.websiteLink.message}</p>}
                                    </div>
                                    <div className="input-container mb-2">
                                        <label htmlFor="description" className="text-lg fontFamily selectionColor">
                                            Description
                                        </label>
                                        <textarea
                                            type="text"
                                            rows={2}
                                            name="description"
                                            className={`input w-full min-h-[100px] max-h-[200px] ${errors.description ? "border-2 border-[#ff5252]" : ""}`}
                                            placeholder="A description of the project / product"
                                            autoComplete="off"
                                            {...register("description",{
                                                required: {
                                                    value: true,
                                                    message: "Required",
                                                },
                                            })}
                                        />
                                        {errors.description && <p className="absolute left-0 -bottom-2 text-[#ff5252]">{errors.description.message}</p>}
                                    </div>
                                </>
                            )}
                            {currentStep === 2 && (
                                <>
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-3xl selectionColor">
                                                Thumbnail
                                            </h2>
                                            <p className="selectionColor">Let’s make sure people can find your project easily.</p>
                                        </div>
                                        {selectedLogoFile ? (
                                            <div className="flex justify-center">
                                                <div className="relative h-[176px] w-[176px]">
                                                    <div
                                                        className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                                                        onClick={() => setselectedLogoFile(null)}
                                                    >
                                                        <XMarkIcon className="text-white h-5" />
                                                    </div>
                                                    <img
                                                        src={selectedLogoFile}
                                                        alt="Selected File | Dust Ecosystem"
                                                        className="rounded-2xl max-h-80 object-contain"
                                                    />
                                                </div>
                                            </div>
                                            
                                        ): (
                                            <div className="flex justify-center">
                                                <div 
                                                    className="w-44 h-44 rounded-xl overflow-hidden border-white border-4 cursor-pointer group hover:border-[#242424]"
                                                    onClick={() => filePickerRefOne.current.click()}
                                                >
                                                    <input
                                                        type="file"
                                                        hidden
                                                        onChange={addProjectLogo}
                                                        ref={filePickerRefOne}
                                                    />
                                                    <div className="flex flex-col h-full justify-center items-center">
                                                        <PlusCircleIcon className="h-[100px] text-white group-hover:text-[#242424]"/>
                                                        <p className="text-white group-hover:text-[#242424]">Select Project </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div  className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-3xl selectionColor">
                                                Screenshots
                                            </h2>
                                            <p className="selectionColor">We recommend at least 1 screenshots of your project.</p>
                                        </div>
                                        {selectedPreviewFile ? (
                                            <div className="flex justify-center">
                                                <div className="relative w-full">
                                                    <div
                                                        className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                                                        onClick={() => setselectedPreviewFile(null)}
                                                    >
                                                        <XMarkIcon className="text-white h-5" />
                                                    </div>
                                                    <img
                                                        src={selectedPreviewFile}
                                                        alt="Selected File | Dust Ecosystem"
                                                        className="rounded-2xl max-h-80 object-contain"
                                                    />
                                                </div>
                                            </div>
                                            
                                        ): (
                                            <div className="flex justify-center">
                                                <div 
                                                    className="w-full p-10 rounded-xl overflow-hidden border-white border-4 cursor-pointer group hover:border-[#242424]"
                                                    onClick={() => filePickerRefOneTwo.current.click()}
                                                >
                                                    <input
                                                        type="file"
                                                        hidden
                                                        onChange={addProjectPreview}
                                                        ref={filePickerRefOneTwo} 
                                                    />
                                                    <div className="flex flex-col h-full justify-center items-center gap-1">
                                                        <PhotoIcon className="h-[75px] text-white group-hover:text-[#242424]"/>
                                                        <p className="text-white group-hover:text-[#242424]">Browse for files</p>
                                                        <p className="text-white group-hover:text-[#242424] max-w-xs text-center">
                                                            Upload at least one image. 1270x760px or higher is recommended, max. 5MB each. The image will be used as a preview.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                </>
                            )}
                            {currentStep === 3 && (
                                <>
                                    <div className="input-container">
                                        <h2 className="font-semibold text-3xl selectionColor pb-4">
                                            How you are using $DUST ?
                                        </h2>
                                        <textarea
                                            type="text"
                                            rows={2}
                                            className={`input w-full min-h-[150px] max-h-[200px] ${errors.dustUsageDescription ? "border-2 border-[#ff5252]" : ""}`}
                                            placeholder="A description of $DUST utilisation in your project / product"
                                            autoComplete="off"
                                            {...register("dustUsageDescription",{
                                                required: {
                                                    value: true,
                                                    message: "Required",
                                                }
                                            })}
                                        />
                                        {errors.dustUsageDescription && <p className="absolute left-0 -bottom-2 text-[#ff5252]">{errors.dustUsageDescription?.message}</p>}
                                    </div>
                                    <div className="input-container gap-4 mb-0">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-3xl selectionColor">
                                                Treasury
                                            </h2>
                                            <p className="selectionColor">If your project holds $DUST, please mention the Wallet address below</p>
                                        </div>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="DAO Wallet"
                                            {...register("daoWallet")}
                                        />
                                    </div>
                                </>
                            )}
                            {currentStep === 4 && (
                                <>
                                    <div className="input-container mb-0 gap-5">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-3xl selectionColor">
                                                Project / Product status
                                            </h2>
                                            <p className="selectionColor">How far along is the project / Product?</p>
                                        </div>
                                        <div>
                                            <ul className="flex flex-col gap-4 w-full">
                                                <li>
                                                    <input 
                                                        type="radio" 
                                                        id="status"
                                                        name="status" 
                                                        value="Live" 
                                                        className="hidden peer" 
                                                        {...register("status")}
                                                    />
                                                    <label htmlFor="status" className="inline-flex justify-between items-center p-2.5 w-full text-white bg-[#242424] rounded-lg border border-white cursor-pointer peer-checked:text-white peer-checked:bg-[#90B578]">                           
                                                        <div className="w-full text-lg font-semibold">
                                                            Released or operational on the Mainnet, Devnet, or Testnet
                                                        </div>
                                                    </label>
                                                </li>
                                                <li>
                                                    <input 
                                                        type="radio" 
                                                        id="buildingStatus" 
                                                        name="status" 
                                                        value="Building" 
                                                        className="hidden peer"
                                                        {...register("status")}
                                                    />
                                                    <label htmlFor="buildingStatus" className="inline-flex justify-between items-center p-2.5 w-full text-white bg-[#242424] rounded-lg border border-white cursor-pointer peer-checked:text-white peer-checked:bg-[#90B578]">
                                                        <div className="w-full text-lg font-semibold">Currently building</div>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> 
                                    <div className="input-container mb-0 gap-5">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-3xl selectionColor">
                                                Category
                                            </h2>
                                            <div className="flex flex-col">
                                                <p className="selectionColor">Select up to 3 categories</p>
                                                <p className="text-xs selectionColor">eg : raffle, defi, product</p>
                                            </div>
                                        </div>
                                        <div className={`flex flex-wrap items-center py-2 px-4 bg-[#242424] rounded-md gap-2 ${categories.length === 0 ? "border-2 border-[#ff5252]" : ""}`}>
                                            {categories.map((category, index) => (
                                                <div className="flex items-center gap-2 bg-[#90B578] h-9 rounded-3xl px-3 cursor-pointer" key={index}>
                                                    <p className="text-lg capitalize">
                                                        {category}
                                                    </p>
                                                    <div className="h-full border-l-2"></div>
                                                    <Cross 
                                                        className="text-white h-4" 
                                                        onClick={() => removeCategory(index)}
                                                    />
                                                </div>
                                            ))}
                                            <input
                                                onKeyDown={handleKeyDown}
                                                type="text"
                                                name="categories"
                                                className="flex-1 text-white text-lg rounded-lg bg-transparent outline-none overflow-hidden"
                                                placeholder="Enter Category"
                                                autoComplete="off"
                                            />
                                            {categories.length === 0 && <p className="absolute left-0 -bottom-2 text-[#ff5252]">Select at least 1 category</p>}
                                        </div>
                                    </div>
                                     
                                </>
                            )}
                            {currentStep === 5 && (
                                <>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-3xl selectionColor">
                                                Socials
                                            </h2>
                                        </div>
                                        <div className="input-container mb-0">
                                            <label htmlFor="twitterURL" className="text-lg fontFamily selectionColor">
                                                Twitter Link
                                            </label>
                                            <input
                                                type="text"
                                                id="twitterURL"
                                                className={`input ${errors.twitterURL ? "border-2 border-[#ff5252]" : ""}`}
                                                placeholder="https://twitter.com/project"
                                                autoComplete="off"
                                                {...register("twitterURL",{
                                                    required: {
                                                        value: true,
                                                        message: "Required",
                                                    },
                                                    pattern: {
                                                        value: /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/,
                                                        message: "Insert a valid URL",
                                                    },
                                                })}
                                            />
                                            {errors.twitterURL && <p className="absolute left-0 -bottom-2 text-[#ff5252]">{errors.twitterURL.message}</p>}
                                        </div>
                                        <div className="input-container">
                                            <label htmlFor="discordURL" className="text-lg fontFamily selectionColor">
                                                Discord Link
                                            </label>
                                            <input
                                                type="text"
                                                name="discordURL"
                                                className={`input ${errors.discordURL ? "border-2 border-[#ff5252]" : ""}`}
                                                placeholder="https://discord.com/invite/project"
                                                autoComplete="off"
                                                {...register("discordURL",{
                                                    required: {
                                                        value: true,
                                                        message: "Required",
                                                    },
                                                    pattern: {
                                                        value: /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/,
                                                        message: "Insert a valid URL",
                                                    },
                                                })}
                                            />
                                            {errors.discordURL && <p className="absolute left-0 -bottom-2 text-[#ff5252]">{errors.discordURL.message}</p>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-3xl selectionColor">
                                                If NFT collection
                                            </h2>
                                        </div>
                                        <div className="input-container mb-0">
                                            <label htmlFor="magicedenURL" className="text-lg fontFamily selectionColor">
                                                Magiceden Link
                                            </label>
                                            <input
                                                type="text"
                                                name="magicedenURL"
                                                className="input"
                                                placeholder="https://magiceden.io/marketplace/t00bs"
                                                autoComplete="off"
                                                {...register("magicedenURL")}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between">
                            {currentStep > 1 && (
                                <button
                                    className="flex justify-center items-center gap-1 text-white py-1 px-2 md:py-1 md:px-3 rounded-full transition ease-in-out hover:-translate-y-1 duration-300"
                                    onClick={previousStep}
                                >
                                    <p className="text-base md:text-lg selectionColor">Go back</p> 
                                </button>
                            )}
                            {currentStep < 5 ? (
                                <>
                                {
                                    currentStep === 4 ? (
                                        <button
                                            className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-1.5 px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 disabled:cursor-not-allowed"
                                            onClick={nextStep}
                                            disabled={categories.length === 0}
                                        >
                                            <p className="text-base md:text-lg">Next Step: {steps[currentStep-1]}</p> 
                                        </button>
                                    ) : (
                                        <button
                                            className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-1.5 px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 disabled:cursor-not-allowed"
                                            onClick={nextStep}
                                            disabled={!isValid}
                                        >
                                            <p className="text-base md:text-lg">Next Step: {steps[currentStep-1]}</p> 
                                        </button>
                                    )
                                }
                                </>
                                
                            ):(
                                <button
                                    className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-1.5 px-3 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 disabled:cursor-not-allowed"
                                    onClick={handleSubmit}
                                    disabled={!isValid}
                                >
                                    {loading && (
                                        <svg className="mr-1 h-6 w-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    <p className="text-base md:text-lg">Update</p> 
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Edit