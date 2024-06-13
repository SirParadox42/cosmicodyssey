import {useState, useEffect} from 'react';
import {StyleSheet, View, Alert, Text} from 'react-native';
import Post from '../components/Post';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';

export default function BlackHole(props) {
    const [isLoading, sendRequest] = useHttp();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            const dataFetcher = async() => {
                try {
                    const response = await sendRequest('post');
                    let greatestBlackHole = response.posts[0];
                    response.posts.forEach(post => post.blackholes.length > greatestBlackHole.blackholes.length ? greatestBlackHole = post : null);
                    setPost(greatestBlackHole);
                } catch (err) {
                    Alert.alert('Error', err.message, [{text: 'Ok'}]);
                }
            };
    
            dataFetcher();
        });
    
        return unsubscribe;
    }, [props.navigation]);

    return (
        <View style={styles.background}>
            {isLoading && <Loading isLoading={isLoading}/>}
            {!isLoading && post && <Post {...post}/>}
            {!isLoading && <Text style={styles.text}>Most Voted Black Hole {post && `(${post.blackholes.length})`}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#c8d7f8',
        flex: 1
    },

    text: {
        fontFamily: 'Space Grotesk',
        fontSize: 25,
        textAlign: 'center',
        margin: 10
    }
});