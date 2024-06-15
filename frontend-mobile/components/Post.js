import {useContext} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native'
import {Ionicons} from '@expo/vector-icons';
import Button from './Button';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';
import {REACT_APP_BACKEND_URL} from '@env';

export default function Post(props) {
    const ctx = useContext(context);
    const navigation = useNavigation();
    const [isLoading, sendRequest] = useHttp();
    
    const handleEdit = () => navigation.navigate('Update Post', {postId: props.id});
    const handleDelete = () => Alert.alert('Deleting Post', `Are you sure you want to delete ${props.title}?`, [{text: 'No', style: 'cancel'}, {text: 'Yes', onPress: () => props.onDelete(props.id), style: 'destructive'}]);
    const vote = async(path) => {
        try {
            await sendRequest(`post/${path}/${props.id}`, 'PATCH', null, {Authorization: `Bearer ${ctx.token}`});
            props.onReload();
        } catch(err) {
            Alert.alert('Error', err.message, [{text: 'Ok'}]);
        }
    };

    return (
        <View style={styles.post}>
            <View style={styles.top}>
                <Text style={[styles.font, styles.title]}>{props.title}</Text>
                <Text style={styles.font}>Created by {props.creator.username} on {props.createdAt}</Text>
            </View>
            <Image style={styles.image} source={{uri: `${REACT_APP_BACKEND_URL}/${props.image}`}}/>
            <View style={styles.descriptionContainer}>
                <Text style={[styles.font, styles.description]}>{props.description}</Text>
            </View>
            <View style={styles.buttons}>
                {ctx.userId === props.creator.id && props.use && (
                    <>
                        <Button style={styles.margin} onPress={handleEdit}><Ionicons name='create' size={25} color='white'/></Button>
                        <Button style={styles.margin} onPress={handleDelete}><Ionicons name='trash' size={25} color='white'/></Button>
                    </>
                )}
                {ctx.isLoggedIn && props.use && (
                    <>
                        <Button style={styles.margin} onPress={() => vote(props.supernovas.includes(ctx.userId) ? 'unsupernova' : 'supernova')}>{props.supernovas.length} <Ionicons name='flame' size={15} color={props.supernovas.includes(ctx.userId) ? 'orange' : 'white'}/></Button>
                        <Button style={styles.margin} onPress={() => vote(props.blackholes.includes(ctx.userId) ? 'unblackhole' : 'blackhole')}>{props.blackholes.length} <Ionicons name='radio-button-on' size={15} color={props.blackholes.includes(ctx.userId) ? 'orange' : 'white'}/></Button>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    post: {
        backgroundColor: '#090b44',
        borderWidth: 3,
        borderColor: 'white'
    },

    top: {
        padding: 10,
        borderBottomWidth: 3,
        borderColor: 'white'
    },

    font: {
        color: 'white',
        fontFamily: 'Space Grotesk',
    },

    title: {
        fontSize: 25
    },

    image: {
        width: '100%',
        height: 200,
        borderBottomWidth: 3,
        borderColor: 'white'
    },

    descriptionContainer: {
        padding: 10,
        borderTopWidth: 3,
        borderColor: 'white'
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
    },

    margin: {
        margin: 5
    }
});
