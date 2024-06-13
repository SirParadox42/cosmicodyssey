import {useState, useContext} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {context} from '../store/context';

export default function Navbar() {
    const ctx = useContext(context);
    const [showSideBar, setShowSideBar] = useState(false);
    const navlinks = (
        <>
            <NavLink to='/' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Posts</NavLink>
            {ctx.isLoggedIn && <NavLink to='/post/new' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>New Post</NavLink>}
            <NavLink to='/supernova' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Supernova</NavLink>
            <NavLink to='/blackhole' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Black Hole</NavLink>
            {!ctx.isLoggedIn && (
                <>
                    <NavLink to='/login' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Login</NavLink>
                    <NavLink to='/signup' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Signup</NavLink>
                </>
            )}
            {ctx.isLoggedIn && <Link to='/' className='navlink' onClick={ctx.logout}>Logout</Link>}
            {ctx.isLoggedIn && <img id='circle' src={`${process.env.REACT_APP_BACKEND_URL}/${ctx.image}`}/>}
        </>
    );

    const handleShowSideBar = () => setShowSideBar(true);
    const handleCloseSideBar = () => setShowSideBar(false);
    
    return (
        <>
            <div id='nav'>
                <div className='flex' id='nav1'>
                    <h1 id='webname' className='flex'>Cosmic<img width='40' src='favicon.ico'/><span id="webname2">dyssey</span></h1>
                    <div id='links' className='flex'>
                        {navlinks}
                    </div>
                </div>
                <div className='flex' id='nav2'>
                    <img onClick={handleShowSideBar} id='lines' src='https://icon-library.com/images/menu-icon-png-3-lines/menu-icon-png-3-lines-3.jpg'/>
                    <h1 id='webname' className='flex'>Cosmic<img width='40' src='favicon.ico'/><span id="webname2">dyssey</span></h1>
                </div>
            </div>
            <AnimatePresence>
                {showSideBar && <motion.div onClick={handleCloseSideBar} initial={{opacity: 0}} animate={{opacity: .5}} exit={{opacity: 0}} className='background'></motion.div>}
            </AnimatePresence>
            <AnimatePresence>
                {showSideBar && (
                    <motion.div initial={{x: '-500%'}} animate={{x: 0}} exit={{x: '-500%'}} transition={{duration: '.2'}} onClick={handleCloseSideBar} id='sidebar'>
                        <div id='column' className='flex'>
                            {navlinks}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}