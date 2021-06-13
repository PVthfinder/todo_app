import React, {useState} from 'react';
import axios from 'axios';

const AddTaskForm = ({list, onAddTask}) => {
    const [visibleForm, setVisibleForm] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState();

    const toggleVisibleForm = () => {
        setVisibleForm(!visibleForm);
        setInputValue('');
    }

    const addTask = () => {
        const obj = { listId: list.id, text: inputValue, completed: false};
        setIsSending(true);
        axios
            .post('http://localhost:3001/tasks', obj)
            .then(({data}) => {
                onAddTask(list.id, data);
                toggleVisibleForm();
            })
            .catch(() => {
                alert('Неудачная попытка добавления задачи!')
            })
            .finally(() => {
                setIsSending(false);
            });
    }
    
    return (
        <div className="tasks__form">
            {!visibleForm ? 
                <div onClick={toggleVisibleForm} className="tasks__form-new">
                    <i>+</i>
                    <span>Новая задача</span>
                </div> :
                <div className="tasks__form-block">
                    <input 
                        className="field" 
                        type="text" 
                        placeholder="Текст задачи"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <button disabled={isSending} onClick={addTask} className="button">
                        {isSending ? 'Добавление...' : 'Добавить задачу'}
                    </button>
                    <button onClick={toggleVisibleForm} className="button button--grey">Отмена</button>
                </div>
            }
        </div>
    );
}

export default AddTaskForm;