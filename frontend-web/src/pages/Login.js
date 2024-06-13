import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import Input from '../components/Input';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import {context} from '../store/context';

export default function Signup() {
    const ctx = useContext(context);
    const [isLoading, error, sendRequest] = useHttp();
    const navigate = useNavigate();
    const [emailInput, emailValid, emailInputClasses, handleEmailChange, handleEmailBlur, handleEmailSubmit, emailInvalid] = useInput('', input => true);
    const [passwordInput, passwordValid, passwordInputClasses, handlePasswordChange, handlePasswordBlur, handlePasswordSubmit, passwordInvalid] = useInput('', input => true);
    
    const handleSubmit = async() => {
        handleEmailSubmit();
        handlePasswordSubmit();

        if (emailValid && passwordValid) {
            try {
                const response = await sendRequest('auth/login', 'POST', JSON.stringify({email: emailInput, password: passwordInput}), {'Content-Type': 'application/json'});
                ctx.login(response.token, response.userId, response.image, null);
                navigate('/');
            } catch(err) {
                return;
            }
        }
    };

    return (
        <div className='animate'>
            <h1 className='header'>Login</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='center invalid'>{error}</h2>}
            {!isLoading && (
                <>
                    <Input inputType='email' type='input' classes={emailInputClasses} message="Input can't be empty." placeholder='Email' value={emailInput} onChange={handleEmailChange} onBlur={handleEmailBlur} invalid={emailInvalid}/>
                    <Input inputType='password' type='input' classes={passwordInputClasses} message='Password length must be more than 7 characters.' placeholder='Password' value={passwordInput} onChange={handlePasswordChange} onBlur={handlePasswordBlur} invalid={passwordInvalid}/>
                    <motion.button onClick={handleSubmit} whileHover={{scale: 1.1, borderColor: 'navy'}}>Login</motion.button>
                </>
            )}
        </div>
    );
}