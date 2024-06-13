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
                let greatestSupernova = response.posts[0];
                response.posts.forEach(post => post.supernovas.length > greatestSupernova.supernovas.length ? greatestSupernova = post : null);
                setPost(greatestSupernova);
            } catch(err) {
                return;
            }
        };

        dataFetcher();
    }, []);

    return (
        <div className='animate'>
            <h1 className='header'>Most Voted Supernova {post && `(${post.supernovas.length})`}</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='invalid center'>{error}</h2>}
            {post && <Post className='highest' onReload={() => {}} onDelete={() => {}} first last {...post}/>}
        </div>
    );
}