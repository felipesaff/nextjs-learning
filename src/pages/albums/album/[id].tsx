import { User } from "@/types";
import axios from "axios"
import { GetServerSideProps } from "next"
import Error from "next/error";
import Link from "next/link";

interface Album {
    userId: number;
    id: number;
    title: string;
}
interface Photo {
    albumId: number;
    id: number;
    thumbnailUrl: string;
    title: string;
    url: string;
}
interface Props {
    album: Album;
    photos: Photo[];
    user: User
    error?: boolean;
}

export default function Album({photos, album, user, error}: Props) {
    console.log(photos, album)
    if(error) return <Error statusCode={500}></Error>
    return (
        <div className="lg:w-1/2 w-3/4 mx-auto py-2">
                <Link href='/albums' className="text-indigo-600">return</Link>
                <div className="border-b border-indigo-600 py-2 my-4">
                    <p className="font-bold text-sm"> {`${user.name}'s album:`} </p>
                    <h1 className="text-center font-bold text-3xl my-4"> {album.title} </h1>
                </div>
                <p className="text-xl text-center mt-8 mb-4">Photos ({photos.length}) </p>
                <div className="grid-cols-4 inline-grid gap-4">
                    {
                        photos.map((photo, i) => (
                            <div className="flex flex-col relative" key={i}>
                                <span className="absolute font-bold text-center px-2 top-4"> {photo.title} </span>
                                <img src={photo.thumbnailUrl} alt="" />
                            </div>
                        ))
                    }
                </div>
            </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const [users, album, photos] = await Promise.all([
            axios.get(`${process.env.API_URL}/users`)
            .then(res => res.data)
            .catch(err => err.json()),
            axios.get(`${process.env.API_URL}/albums/${context.params?.id}`)
            .then(res => res.data)
            .catch(err => err.json()),
            await axios.get(`${process.env.API_URL}/albums/${context.params?.id}/photos`)
            .then(res => res.data)
            .catch(err => err.json())
        ]);

        const user = users.find((user: User) => user.id === album.userId)
        return {props: { album, photos, user } }
    }
    catch {
        return {props: {error: true}}
    }
}