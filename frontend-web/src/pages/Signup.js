import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import useImageUpload from '../hooks/useImageUpload';
import Input from '../components/Input';
import ImageUpload from '../components/ImageUpload';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import {context} from '../store/context';

export default function Signup() {
    const ctx = useContext(context);
    const [isLoading, error, sendRequest] = useHttp();
    const navigate = useNavigate();
    const [userInput, userValid, userInputClasses, handleUserChange, handleUserBlur, handleUserSubmit, userInvalid] = useInput('', input => input.length > 0);
    const [file, previewUrl, fileValid, filePickerRef, handlePicked, handlePickImage, fileInvalid, fileInputClasses] = useImageUpload();
    const [emailInput, emailValid, emailInputClasses, handleEmailChange, handleEmailBlur, handleEmailSubmit, emailInvalid] = useInput('', input => input.length > 0);
    const [passwordInput, passwordValid, passwordInputClasses, handlePasswordChange, handlePasswordBlur, handlePasswordSubmit, passwordInvalid] = useInput('', input => input.length > 7);
    
    const handleSubmit = async() => {
        handleUserSubmit();
        handleEmailSubmit();
        handlePasswordSubmit();

        if (userValid && fileValid && emailValid && passwordValid) {
            const formData = new FormData();
            formData.append('username', userInput);
            formData.append('image', file);
            formData.append('email', emailInput);
            formData.append('password', passwordInput);

            try {
                const response = await sendRequest('auth/signup', 'POST', formData);
                ctx.login(response.token, response.userId, response.image, null);
                navigate('/');
            } catch(err) {
                return;
            }
        }
    };

    return (
        <div className='animate'>
            <h1 className='header'>Signup</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='center invalid'>{error}</h2>}
            {!isLoading && (
                <>
                    <Input inputType='text' type='input' classes={userInputClasses} message="Input can't be empty." placeholder='Username' value={userInput} onChange={handleUserChange} onBlur={handleUserBlur} invalid={userInvalid}/>
                    <ImageUpload invalid={fileInvalid} classes={fileInputClasses} filePickerRef={filePickerRef} handlePicked={handlePicked} previewUrl={previewUrl} handlePickImage={handlePickImage} message='File is invalid'/>
                    <Input inputType='email' type='input' classes={emailInputClasses} message="Input can't be empty." placeholder='Email' value={emailInput} onChange={handleEmailChange} onBlur={handleEmailBlur} invalid={emailInvalid}/>
                    <Input inputType='password' type='input' classes={passwordInputClasses} message='Password length must be more than 7 characters.' placeholder='Password' value={passwordInput} onChange={handlePasswordChange} onBlur={handlePasswordBlur} invalid={passwordInvalid}/>
                    <motion.button onClick={handleSubmit} whileHover={{scale: 1.1, borderColor: 'navy'}}>Signup</motion.button>
                </>
            )}
        </div>
    );
}