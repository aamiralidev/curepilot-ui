import React, { useState, useRef } from 'react'
import {LuSend} from 'react-icons/lu'
import ChatGroup from '../components/ChatGroup'
import {completeChat} from '../api/ChatApi'

const ChatScreen = () => {


    const initialChats = []
    const [prompt, setPrompt] = useState('')
    const [disableSubmit, setDisableSubmit] = useState()
    const [chats, setChats] = useState(initialChats)
    const [currentConversationTurn, setCurrentConversationTurn] = useState(1)
    const textarea = useRef()

    const addChat = (role, message) => {
        return new Promise((resolve) => {
            setChats(prevChats => {
                const newTurn = prevChats.length > 0 ? prevChats[prevChats.length - 1].turn + 1 : 1;
                const updatedChats = [...prevChats, { role, message, turn: newTurn }];
                resolve();
                return updatedChats;
            });
        });
    }

    const handlePromptChange = (event) => {
        setPrompt(event.target.value)
        event.target.style.height = '5vh';
        event.target.style.height = event.target.scrollHeight + 'px'
    }
    const handlePromptSubmit = async (event) => {
        event.preventDefault()
        const message = prompt
        setPrompt(' ')
        if(textarea.current){
            textarea.current.style.height = '5vh'
        }
        // setDisableSubmit(true)
        addChat('user', message)
        await completeChat(message)
            .then((response) => {
                console.log(response.data)
                addChat('assistant', response.data)
            })
            .catch((error)=> {
                console.log(error)
            })
        // setDisableSubmit(false)
    }

    return (
        <div className='container-fluid d-flex justify-content-center align-items-center w-100' style={{ height: '100vh' }}>
            <div className='row w-100 h-100 d-flex justify-content-between align-items-between'>
                <ChatGroup chats={chats}/>
                <form className='d-flex justify-content-center align-items-end gap-1' style={{position: 'fixed', bottom: '3%'}} onSubmit={handlePromptSubmit}>
                    <textarea id="input-textarea" type='text' className='form-control prompt scroll-bar-custom' name='prompt' onChange={handlePromptChange} value={prompt} style={{width: '80%', height: '5vh', maxHeight: '50vh'}} ref={textarea} />
                    <button className='btn send-btn' type="submit" disabled={disableSubmit}><LuSend size={20} color='white' /></button>
                </form>
            </div>
        </div>
    )
}

export default ChatScreen