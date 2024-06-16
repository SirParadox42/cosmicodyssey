import {useContext, useEffect} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {context} from '../store/context';
import useHttp from '../hooks/useHttp';
import useInput from '../hooks/useInput';
import Loading from '../components/Loading';
import Input from '../components/Input';
import Button from '../components/Button';

export default function UpdatePost(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [titleInput, titleValid, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid, setTitleInput] = useInput(input => input.length > 0 && input.length <= 20);
    const [descriptionInput, descriptionValid, handleDescriptionChange, handleDescriptionBlur, handleDescriptionSubmit, descriptionInvalid, setDescriptionInput] = useInput(input => input.length > 0 && input.length <= 300);

    const updatePost = async() => {
        handleTitleSubmit();
        handleDescriptionSubmit();

        if (titleValid && descriptionValid) {
            try {
                await sendRequest(`post/${props.route.params.postId}`, 'PATCH', JSON.stringify({title: titleInput, description: descriptionInput}), {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
                props.navigation.navigate('Posts');
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`post/${props.route.params.postId}`);
                setTitleInput(response.post.title);
                setDescriptionInput(response.post.description);
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };

        dataFetcher();
        props.navigation.setOptions({headerBackTitle: 'Posts'});
    }, [props.navigation]);

    return (
        <ScrollView style={styles.form} alwaysBounceVertical={false}>
            <Loading isLoading={isLoading} style={styles.loading}/>
            <Input message={titleInvalid ? 'Input length must be between 1 and 20 characters.' : ''} input={{placeholder: 'Title', autoCorrect: false, autoCapitalize: false, value: titleInput, onChangeText: handleTitleChange, onBlur: handleTitleBlur}}/>
            <Input message={descriptionInvalid ? 'Input length must be between 1 and 300 characters.' : ''} input={{placeholder: 'Description', autoCorrect: false, autoCapitalize: false, multiline: true, value: descriptionInput, onChangeText: handleDescriptionChange, onBlur: handleDescriptionBlur}}/>
            <Button onPress={updatePost}>Update Post</Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    form: {
        padding: 20
    },

    loading: {
        position: 'absolute',
        top: -15
    }
});
