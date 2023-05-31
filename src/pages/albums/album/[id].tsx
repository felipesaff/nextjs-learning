import { Album, User } from "@/types";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Error from "next/error";
import Link from "next/link";

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
    if(error) return <Error statusCode={500}></Error>
    return (
        <div className="lg:w-1/2 w-3/4 mx-auto py-2">
                <Link href='/albums' className="text-indigo-600">return</Link>
                <div className="border-b border-indigo-600 py-2 my-4">
                    <p className="font-bold text-sm"> {`${user.name}'s album:`} </p>
                    <h1 className="text-center font-bold text-3xl my-4"> {album.title} </h1>
                </div>
                <p className="text-xl text-center mt-8 mb-4">Photos ({photos.length}) </p>
                <div className="flex flex-wrap justify-center">
                    {
                        photos.map((photo, i) => (
                            <div className="flex flex-col justify-center items-center relative overflow-hidden p-2" key={i}>
                                <span className="absolute font-bold text-center px-2"> {photo.title} </span>
                                <img src={photo.thumbnailUrl} alt="" />
                            </div>
                        ))
                    }
                </div>
            </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const res: Album[] = await axios.get(
        `${process.env.API_URL}/albums`
    )
    .then(res => res.data);

    const paths = res.map(post => ({
        params: {
            id: post.id.toString()
        }
    }))

    return {paths, fallback: 'blocking'}
}

export const getStaticProps: GetStaticProps = async (context) => {
    try {
        const [users, album, photos] = await Promise.all([
            axios.get(`${process.env.API_URL}/users`)
            .then(res => res.data),
            axios.get(`${process.env.API_URL}/albums/${context.params?.id}`)
            .then(res => res.data),
            await axios.get(`${process.env.API_URL}/albums/${context.params?.id}/photos`)
            .then(res => res.data)
        ]);

        const user = users.find((user: User) => user.id === album.userId)
        return {props: { album, photos, user } }
    }
    catch(err) {
        return {notFound: true}
    }
    
}