import {useContext, useState, useEffect} from 'react';
import {StyleSheet, ScrollView, Alert} from 'react-native';
import {context} from '../store/context';
import useInput from '../hooks/useInput';
import useHttp from '../hooks/useHttp';
import Input from '../components/Input';
import ImagePicker from '../components/ImagePicker';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function NewPost(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [titleInput, titleValid, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid, setTitleInput] = useInput(input => input.length > 0 && input.length <= 20);
    const [selectedImage, setSelectedImage] = useState(null);
    const [descriptionInput, descriptionValid, handleDescriptionChange, handleDescriptionBlur, handleDescriptionSubmit, descriptionInvalid, setDescriptionInput] = useInput(input => input.length > 0 && input.length <= 300);
    
    const handleSelectImage = image => setSelectedImage(image);
    const createPost = async() => {
        handleTitleSubmit();
        handleDescriptionSubmit();

        if (titleValid && selectedImage && descriptionValid) {
            const formData = new FormData();
            formData.append('title', titleInput);
            formData.append('image', {uri: selectedImage.uri, type: 'image/jpeg', name: 'profile.jpeg', size: selectedImage.fileSize});
            formData.append('description', descriptionInput);
            formData.append('createdAt', new Date().toLocaleDateString());
            
            try {
                await sendRequest('post', 'POST', formData, {Authorization: `Bearer ${ctx.token}`});
                props.navigation.navigate('Posts');
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        }
    };

    useEffect(() => {
        const cleanup = props.navigation.addListener('focus', () => {
            setTitleInput('');
            setSelectedImage(null);
            setDescriptionInput('');
        });

        return cleanup
    }, [props.navigation]);

    return (
        <ScrollView style={styles.form} alwaysBounceVertical={false}>
            <Loading isLoading={isLoading} style={styles.loading}/>
            <Input message={titleInvalid ? 'Input length must be between 1 and 20 characters.' : ''} input={{placeholder: 'Title', autoCorrect: false, autoCapitalize: false, value: titleInput, onChangeText: handleTitleChange, onBlur: handleTitleBlur}}/>
            <ImagePicker onSelectImage={handleSelectImage} selectedImage={selectedImage}/>
            <Input message={descriptionInvalid ? 'Input length must be between 1 and 300 characters.' : ''} input={{placeholder: 'Description', autoCorrect: false, autoCapitalize: false, multiline: true, value: descriptionInput, onChangeText: handleDescriptionChange, onBlur: handleDescriptionBlur}}/>
            <Button onPress={createPost}>Create Post</Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    form: {
        backgroundColor: '#c8d7f8',
        flex: 1,
        padding: 20
    },

    loading: {
        position: 'absolute',
        top: -15
    }
});