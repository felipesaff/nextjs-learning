import Link from 'next/link';
import axios from 'axios';
import { GetStaticProps } from 'next';

interface User {
    id: number;
    name: string;
}
interface Album {
    id: number;
    userId: number;
    title: string;
}
interface Props {
    albums: Album[]
    albumsOwners: User[]
}

export default function Albums({albums, albumsOwners}: Props) {
  return (
    <main
      className='flex flex-col min-h-screen items-center p-24'
    >
        <Link href='/' className="text-indigo-600">return</Link>
        {
            albums.map((album, i) => (
                <Link
                    href={`/albums/album/${album.id}`}
                    key={i}
                    className='border border-indigo-400 px-2 py-4 my-2 rounded-lg w-96 max-w-[80vw]'
                >
                    <p>Album by: {albumsOwners.find(owner => owner.id === album.userId)?.name} </p>
                    <h1 className='font-bold text-lg mb-2' > {album.title} </h1>
                </Link>
            ))
        }
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
    const [albums,albumsOwners] = await Promise.all([
        axios.get(`${process.env.API_URL}/albums`)
        .then(res => res.data),
        axios.get(`${process.env.API_URL}/users`)
        .then(res =>res.data)
    ])
    return {props: { albums, albumsOwners } }
}