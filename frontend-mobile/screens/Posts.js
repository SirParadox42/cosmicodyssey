import {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, View, StyleSheet, Text} from 'react-native';
import Post from '../components/Post';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function Posts(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [posts, setPosts] = useState([]);
    const [empty, setEmpty] = useState(false);
    const [reload, setReload] = useState(false);

    const handleReload = () => setReload(prev => !prev);
    const handleDelete = async(id) => {
        try {
            await sendRequest(`post/${id}`, 'DELETE', null, {Authorization: `Bearer ${ctx.token}`});
            setPosts(prev => prev.filter(post => post.id !== id));
        } catch(err) {
            Alert.alert('Error', err.message, [{text: 'Ok'}]);
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest('post');
                response.posts.length === 0 ? setEmpty(true) : setPosts(response.posts);
            } catch (err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };
        const cleanup = props.navigation.addListener('focus', dataFetcher);
    
        dataFetcher();
        return cleanup;
    }, [props.navigation, reload]);

    return (
        <View style={styles.posts}>
            <View style={styles.loading}>
                <Loading isLoading={isLoading}/>
            </View>
            {empty && <Text style={styles.text}>No posts created.</Text>}
            {!empty && posts.length > 0 && <FlatList data={posts} renderItem={item => <Post use onReload={handleReload} onDelete={handleDelete} {...item.item}/>} keyExtractor={item => item.id}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    posts: {
        backgroundColor: '#090b44',
        flex: 1
    },

    text: {
        textAlign: 'center',
        padding: 20,
        fontFamily: 'Space Grotesk',
        fontSize: 20
    },

    loading: {
        borderColor: 'white',
        borderBottomWidth: .17
    }
});