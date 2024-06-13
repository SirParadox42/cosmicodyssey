import {useEffect, useState} from "react";
import useHttp from '../hooks/useHttp';
import Post from '../components/Post';
import Loading from '../components/Loading';

export default function Supernova() {
    const [isLoading, error, sendRequest] = useHttp();
    const [post, setPost] = useState();

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest('post');
                let greatestBlackHole = response.posts[0];
                response.posts.forEach(post => post.blackholes.length > greatestBlackHole.blackholes.length ? greatestBlackHole = post : null);
                setPost(greatestBlackHole);
            } catch(err) {
                return;
            }
        };

        dataFetcher();
    }, []);

    return (
        <div className='animate'>
            <h1 className='header'>Most Voted Black Hole {post && `(${post.blackholes.length})`}</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='invalid center'>{error}</h2>}
            {post && <Post className='highest' onReload={() => {}} onDelete={() => {}} first last {...post}/>}
        </div>
    );
}