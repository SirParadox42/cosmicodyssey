import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function Post(props) {
    const ctx = useContext(context);
    const [isLoading, error, sendRequest] = useHttp();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const handleRedirect = () => navigate(`/post/${props.id}`);
    const handleShowDeleteModal = () => setShowDeleteModal(true);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleDelete = () => {
        props.onDelete(props.id);
        handleCloseDeleteModal();
    };
    const vote = async(path) => {
        try {
            await sendRequest(`post/${path}/${props.id}`, 'PATCH', null, {Authorization: `Bearer ${ctx.token}`});
            props.onReload();
        } catch(err) {
            return;
        }
    };

    return (
        <AnimatePresence>
            <motion.div style={{margin: !ctx.isLoggedIn ? '-5px' : '-20px', marginBottom: props.last ? '10%' : '0%'}} key={props.id} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, height: 0}} transition={{type: 'spring', duration: .5}} className={`post ${props.first && 'first'} ${props.last && 'last'} ${props.className && props.className}`}>
                <div className='flex creators'>
                    <h1 className='title'>{props.title}</h1>
                    <div className='flex'>
                        <h4>Created by <b>{props.creator.username}</b> on <b>{props.createdAt}</b></h4>
                    </div>
                </div>
                <img alt='' className='postimg' src={`${process.env.REACT_APP_BACKEND_URL}/${props.image}`}/>
                <p className='postdesc'>{props.description}</p>
                {ctx.userId === props.creator.id && props.show && (
                    <div id='change' className='flex buttons'>
                        <motion.button onClick={handleRedirect} whileHover={{scale: 1.1, border: '3px outset navy'}}>Edit</motion.button>
                        <motion.button onClick={handleShowDeleteModal} whileHover={{scale: 1.1, border: '3px outset navy'}}>Delete</motion.button>
                    </div>
                )}
                {ctx.isLoggedIn && props.show && (
                    <div id='vote' style={{marginTop: ctx.userId === props.creator.id ? '-50px' : '0'}} className='buttons'>
                        <motion.button onClick={() => vote(props.supernovas.includes(ctx.userId) ? 'unsupernova' : 'supernova')} whileHover={{scale: 1.1, border: '3px outset navy'}}>{props.supernovas.length} ☄️</motion.button>
                        <motion.button onClick={() => vote(props.blackholes.includes(ctx.userId) ? 'unblackhole' : 'blackhole')} whileHover={{scale: 1.1, border: '3px outset navy'}}>{props.blackholes.length} ⚫</motion.button>
                        {error && <h2 className='center invalid'>{error}</h2>}
                    </div>
                )}
                <div className='modal'>
                    <AnimatePresence>
                        {showDeleteModal && <motion.div initial={{opacity: 0}} animate={{opacity: .5}} exit={{opacity: 0}} className='background'></motion.div>}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showDeleteModal && (
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} id='delete'>
                                <h2>Are you sure you want to delete <i>{props.title}</i>?</h2>
                                <div className='flex' id='buttons'>
                                    <motion.button onClick={handleDelete} whileHover={{scale: 1.1, border: '3px outset navy'}}>Yes</motion.button>
                                    <motion.button onClick={handleCloseDeleteModal} whileHover={{scale: 1.1, border: '3px outset navy'}}>No</motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}