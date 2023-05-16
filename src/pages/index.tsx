import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Link
                href={'/blog'}
                className="text-center w-28 py-2 bg-gradient-to-r from-indigo-500 to-indigo-800 my-1 rounded-lg"
            >
                Blog
            </Link>
            <Link
                href={'/albums'}
                className="text-center w-28 py-2 bg-gradient-to-r from-emerald-500 to-emerald-700 my-1 rounded-lg"
            >
                Albums
            </Link>
        </div>
    )
}