import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import Input from '../components/Input';
import useInput from '../hooks/useInput';
import useImageUpload from '../hooks/useImageUpload';
import ImageUpload from '../components/ImageUpload';
import useRouteProtection from '../hooks/useRouteProtection';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import {context} from '../store/context';

export default function NewPost() {
    useRouteProtection();
    const ctx = useContext(context);
    const [isLoading, error, sendRequest] = useHttp();
    const navigate = useNavigate();
    const [titleInput, titleValid, titleInputClasses, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid] = useInput('', input => input.length > 0 && input.length <= 20);
    const [descriptionInput, descriptionValid, descriptionInputClasses, handleDescriptionChange, handleDescriptionBlur, handleDescriptionSubmit, descriptionInvalid] = useInput('', input => input.length > 0 && input.length <= 300);
    const [file, previewUrl, fileValid, filePickerRef, handlePicked, handlePickImage, fileInvalid, fileInputClasses] = useImageUpload();

    const handleSubmit = async() => {
        handleTitleSubmit();
        handleDescriptionSubmit();

        if (titleValid && descriptionValid && fileValid) {
            const formData = new FormData();
            formData.append('title', titleInput);
            formData.append('description', descriptionInput);
            formData.append('image', file);
            formData.append('createdAt', new Date().toLocaleDateString());

            try {
                await sendRequest('post/', 'POST', formData, {Authorization: `Bearer ${ctx.token}`});
                navigate('/');
            } catch(err) {
                return;
            }
        }
    };

    return (
        <div className='animate'>
            <h1 className='header'>New Post</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='invalid center'>{error}</h2>}
            {!isLoading && (
                <>
                    <Input inputType='text' type='input' classes={titleInputClasses} message='Input length must be between 1 and 20 characters.' placeholder='Title' value={titleInput} onChange={handleTitleChange} onBlur={handleTitleBlur} invalid={titleInvalid}/>
                    <ImageUpload invalid={fileInvalid} classes={fileInputClasses} filePickerRef={filePickerRef} handlePicked={handlePicked} previewUrl={previewUrl} handlePickImage={handlePickImage} message='File is invalid'/>
                    <Input type='textarea' classes={descriptionInputClasses} message='Input length must be between 1 and 300 characters.' placeholder='Description' value={descriptionInput} onChange={handleDescriptionChange} onBlur={handleDescriptionBlur} invalid={descriptionInvalid}/>
                    <motion.button onClick={handleSubmit} whileHover={{scale: 1.1, border: '3px outset navy'}}>Create Post</motion.button>
                </>
            )}
        </div>
    );
}