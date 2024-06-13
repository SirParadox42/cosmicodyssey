import {motion, AnimatePresence} from 'framer-motion';

export default function Input(props) {
    return (
        <div className={props.classes}>
            <AnimatePresence>
                {props.invalid && <motion.p className='label' initial={{height: 0, opacity: 0}} animate={{height: 16, opacity: 1}} exit={{height: 0, opacity: 0}} transition={{duration: '.2'}}>{props.message}</motion.p>}
            </AnimatePresence>
            {props.type === 'input' ? <input type={props.inputType} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onBlur={props.onBlur}/> : <textarea defaultValue={props.defaultValue} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onBlur={props.onBlur}/>}
        </div>
    );
}