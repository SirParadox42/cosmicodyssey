import {useContext, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {motion} from 'framer-motion';
import Input from '../components/Input';
import Loading from '../components/Loading';
import useInput from '../hooks/useInput';
import useRouteProtection from '../hooks/useRouteProtection';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function UpdatePost() {
    useRouteProtection();
    const ctx = useContext(context);
    const [isLoading, error, sendRequest] = useHttp();
    const navigate = useNavigate();
    const params = useParams();
    const [titleInput, titleValid, titleInputClasses, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid, setTitleInput] = useInput('', input => input.length > 0 && input.length <= 20);
    const [descriptionInput, descriptionValid, descriptionInputClasses, handleDescriptionChange, handleDescriptionBlur, handleDescriptionSubmit, descriptionInvalid, setDescriptionInput] = useInput('', input => input.length > 0 && input.length < 300);
    
    const handleSubmit = async() => {
        handleTitleSubmit();
        handleDescriptionSubmit();

        if (titleValid && descriptionValid) {
            try {
                await sendRequest(`post/${params.postId}`, 'PATCH', JSON.stringify({title: titleInput, description: descriptionInput}), {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
                navigate('/');
            } catch(err) {
                console.log(err);
                return;
            }
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`post/${params.postId}`);
                setTitleInput(response.post.title);
                setDescriptionInput(response.post.description);
            } catch(err) {
                console.log(err);
            }
        };
    
        dataFetcher();
    }, []);

    return (
        <div className='animate'>
            <h1 className='header'>Update Post</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='inline center'>{error}</h2>}
            {!isLoading && (
                <>
                    <Input inputType='text' type='input' classes={titleInputClasses} message='Input length must be between 0 and 20 characters.' placeholder='Title' value={titleInput} onChange={handleTitleChange} onBlur={handleTitleBlur} invalid={titleInvalid}/>
                    <Input type='textarea' classes={descriptionInputClasses} message='Input length must be between 0 and 300 characters.' placeholder='Description' value={descriptionInput} onChange={handleDescriptionChange} onBlur={handleDescriptionBlur} invalid={descriptionInvalid}/>
                    <motion.button onClick={handleSubmit} whileHover={{scale: 1.1, border: '3px outset navy'}}>Update Post</motion.button>
                </>
            )}
        </div>
    );
}