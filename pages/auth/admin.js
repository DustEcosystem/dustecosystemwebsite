import Layout from "../../components/Layout";
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import {useEffect} from "react"

const AdminPage = () => {
    const  {data: session} = useSession();
    const router = useRouter()

    useEffect(() =>  {
        if(!session) {
            router.replace("/");
            return null;
        }
    },[])

    return (
        <Layout showSubmitProjectBtn={false} showFooter={false}>
            <div className="text-white">
                Admin
            </div>
        </Layout>
    )
}

export default AdminPage;