import Verify from "@/components/auth/verify";

export default async function VerifyPage({params}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return (
        <>
            <Verify id={id}/>
        </>
    )
}