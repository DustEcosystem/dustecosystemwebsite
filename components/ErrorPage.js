// Components And Hooks
import Layout from "./Layout";
import Link from "next/link";

const ErrorPage = ({projectId}) => {
    return (
        <Layout showFooter={false} title={`Not Authorized`}>
            <div className="flex flex-col justify-center items-center min-h-[70vh] text-white fontFamily gap-3">
                <div className="flex flex-col justify-center items-center gap-1">
                    <h1 className="text-3xl text-white">Access denied</h1>
                    <p>You are not authorized to access this page</p>
                </div>
                <Link
                    href={{
                        pathname:"/[projectID]",
                    }} 
                    as={`/${projectId}`}
                >
                    <button
                        className="flex justify-center items-center gap-1 text-white bg-[#90B578] py-2.5 px-5 rounded-full hover:shadow-[3.0px_3.0px_rgba(144,181,120,0.5)] transition ease-in-out hover:-translate-y-1 duration-300 text-base md:text-lg cursor-pointer"
                    >
                        <p>Go back</p>
                    </button>
                </Link>
            </div>
        </Layout>
    )
}

export default ErrorPage;