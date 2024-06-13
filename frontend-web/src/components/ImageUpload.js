import {motion, AnimatePresence} from 'framer-motion';

export default function ImageUpload(props) {
    return (
        <>
            <AnimatePresence>
                {props.invalid && <motion.p className='label' initial={{height: 0, opacity: 0}} animate={{height: 16, opacity: 1}} exit={{height: 0, opacity: 0}} transition={{duration: '.2'}}>{props.message}</motion.p>}
            </AnimatePresence>
            <input type='file' ref={props.filePickerRef} style={{display: 'none'}} accept='.jpg,.png,.jpeg' onChange={props.handlePicked}/>
            <AnimatePresence>
                {props.previewUrl && <motion.img initial={{height: 0}} animate={{height: 200}} exit={{height: 0}} width='200' id='file' src={props.previewUrl} alt='Preview'/>}
            </AnimatePresence>
            {!props.previewUrl && <p id='pickimage'>Please pick a file.</p>}
            <motion.button whileHover={{scale: 1.1, border: '3px outset navy'}} onClick={props.handlePickImage}>Pick Image</motion.button>
        </>
    );
}