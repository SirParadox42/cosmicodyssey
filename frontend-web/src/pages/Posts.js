import {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import Post from '../components/Post';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function Posts() {
    const ctx = useContext(context);
    const [isLoading, error, sendRequest] = useHttp();
    const [reload, setReload] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const handleReload = () => setReload(prev => !prev);
    const handleRedirect = () => navigate('/post/new');
    const handleDelete = async(id) => {
        try {
            await sendRequest(`post/${id}`, 'DELETE', null, {Authorization: `Bearer ${ctx.token}`});
            setPosts(prev => prev.filter(post => post.id !== id));
        } catch(err) {
            return err;
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest('post');
                setPosts(response.posts);
            } catch(err) {
                return;
            }
        };

        dataFetcher();
    }, [reload]);

    return (
        <div className='animate'>
            <h1 className='header'>Home</h1>
            <p className='postdesc'>Welcome to CosmicOdyssey! CosmicOdyssey is a blog where fans of astronomy can come together and post their astronomical observations. Users can give each post an upvote (supernova) and a downvote (blackhole). You can view the post with the most supernova votes and the post with the most black hole votes via the links above.</p>
            <motion.button style={{opacity: ctx.isLoggedIn ? 1 : 0, visibility: ctx.isLoggedIn ? 'visible' : 'hidden'}} id='newpost' onClick={handleRedirect} whileHover={{scale: 1.1, border: '3px outset navy'}}>New Post</motion.button>
            {isLoading && <Loading/>}
            {error && <h2 className='invalid center'>{error}</h2>}
            {!isLoading && !error && posts.length === 0 && <h2 className='center'>No posts.</h2>}
            {!error && posts.length > 0 && (
                <div id="posts">
                    {posts.map((post, index) => <Post show onReload={handleReload} onDelete={handleDelete} first={index === 0} last={index === posts.length - 1} {...post}/>)}
                </div>
            )}
        </div>
    );
}