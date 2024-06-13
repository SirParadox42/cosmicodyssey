import {Pressable, StyleSheet, Text} from 'react-native';

export default function Button(props) {
    return (
        <Pressable style={({pressed}) => [styles.button, pressed && styles.pressed, props.style]} onPress={props.onPress}>
            <Text style={[styles.text, styles.font]}>{props.children}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#090b44',
        padding: 5,
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 2,
        margin: 'auto',
        marginVertical: 2.5,
        display: 'block',
        justifyContent: 'center',
        
    },

    text: {
        color: 'white',
        fontSize: 17,
        textAlign: 'center'
    },

    pressed: {
        opacity: 0.75
    },

    font: {
        fontFamily: 'Space Grotesk'
    }
});