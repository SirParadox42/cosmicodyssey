import {useState} from 'react';

export default function useInput(text, validation) {
    const [input, setInput] = useState(text);
    const [touched, setTouched] = useState(false);
    const valid = validation(input);
    const invalid = !valid && touched;
    const inputClasses = invalid ? 'invalid' : '';
    
    const handleChange = e => setInput(e.target.value);
    const handleBlur = () => setTouched(true);
    const handleSubmit = () => setTouched(valid ? false : true);

    return [input, valid, inputClasses, handleChange, handleBlur, handleSubmit, invalid, setInput];
}