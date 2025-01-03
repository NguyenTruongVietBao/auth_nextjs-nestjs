import HomePage from "@/components/layout/homepage";
import Link from "next/link";

export default function Home() {
    return (
        <div>
            <HomePage/>
            <Link href={'/auth/login'}>Login</Link>
        </div>
    );
}
