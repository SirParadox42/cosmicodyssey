import {useContext, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import Input from '../components/Input';
import useInput from '../hooks/useInput';
import Button from '../components/Button';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import ImagePicker from '../components/ImagePicker';
import {context} from '../store/context';

export default function Login(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [userInput, userValid, handleUserChange, handleUserBlur, handleUserSubmit, userInvalid] = useInput(input => input.length > 0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [emailInput, emailValid, handleEmailChange, handleEmailBlur, handleEmailSubmit, emailInvalid] = useInput(input => input.length > 0);
    const [passwordInput, passwordValid, handlePasswordChange, handlePasswordBlur, handlePasswordSubmit, passwordInvalid] = useInput(input => input.length > 7);

    const handleSelectImage = image => setSelectedImage(image);
    const signup = async() => {
        handleUserSubmit();
        handleEmailSubmit();
        handlePasswordSubmit();

        if (userValid && emailValid && passwordValid && selectedImage) {
            const formData = new FormData();
            formData.append('username', userInput);
            formData.append('image', {uri: selectedImage.uri, type: 'image/jpeg', name: 'profile.jpeg', size: selectedImage.fileSize});
            formData.append('email', emailInput);
            formData.append('password', passwordInput);

            try {
                const response = await sendRequest('auth/signup', 'POST', formData);
                ctx.login(response.token, response.userId);
                props.navigation.navigate('Posts');
            } catch(err) {
                Alert.alert('Authentication Error', err.message, [{text: 'Ok'}]);
            }
        }
    };

    return (
        <ScrollView style={styles.main} alwaysBounceVertical={false}>
            <Text style={[styles.welcome, styles.font]}>Create Account</Text>
            <Loading isLoading={isLoading}/>
            <View style={styles.form}>
                <Input message={userInvalid ? 'Input can\'t be empty.' : ''} input={{placeholder: 'Username', autoCorrect: false, autoCapitalize: false, value: userInput, onChangeText: handleUserChange, onBlur: handleUserBlur}}/>
                <ImagePicker onSelectImage={handleSelectImage}/>
                <Input message={emailInvalid ? 'Input can\'t be empty.' : ''} input={{placeholder: 'Email', autoCorrect: false, autoCapitalize: false, value: emailInput, onChangeText: handleEmailChange, onBlur: handleEmailBlur}}/>
                <Input message={passwordInvalid ? 'Input length must be greater than 7.' : ''} input={{placeholder: 'Password', autoCorrect: false, autoCapitalize: false, secureTextEntry: true, value: passwordInput, onChangeText: handlePasswordChange, onBlur: handlePasswordBlur}}/>
                <Button onPress={signup} style={styles.button}>Signup</Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    main: {
        padding: 30
    },

    welcome: {
        fontSize: 30,
        textDecorationLine: 'underline',
        textAlign: 'center'
    },

    form: {
        marginTop: 10
    },

    font: {
        fontFamily: 'Space Grotesk'
    },

    button: {
        width: 210,
        padding: 10
    }
});