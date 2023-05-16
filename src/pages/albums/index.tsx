import Link from 'next/link';
import axios from 'axios';

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
    albumsOwner: User[]
}

export default function Albums({albums, albumsOwner}: Props) {
    console.log(albums)
    console.log(albumsOwner)
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
                    <p>Album by: {albumsOwner.find(owner => owner.id === album.userId)?.name} </p>
                    <h1 className='font-bold text-lg mb-2' > {album.title} </h1>
                </Link>
            ))
        }
    </main>
  )
}

export async function getStaticProps() {
    const [albums,albumsOwner] = await Promise.all([
        axios.get(`${process.env.API_URL}/albums`)
        .then(res => res.data)
        .catch(err => err),
        axios.get(`${process.env.API_URL}/users`)
        .then(res =>res.data)
        .catch(err => err.json())
    ])
    return {props: { albums, albumsOwner } }
}