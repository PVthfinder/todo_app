import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import AddTaskForm from './AddTaskForm';
import Task from './Task';

import editSvg from '../../assets/images/edit.svg';

import './Tasks.scss';

const Tasks = ({list, onEditTitle, onAddTask, withoutEmpty, onRemoveTask, onEditTask, onCompleteTask}) => {
    const editTitle = () => {
        const newTitle = window.prompt('Введите название списка', list.name);
        
        if (!newTitle) {
            return;
          }
        
        if (newTitle) {
            onEditTitle(list.id, newTitle);
        }
        axios
            .patch('http://localhost:3001/lists/' + list.id, {name: newTitle})
            .catch(() => alert('Не удалось поменять название!'));

    }

    return (
        <div className="tasks">
            <Link to={`/lists/${list.id}`}>
                <h1 style={{color:list.color.hex}} className="tasks__title">
                    {list.name}
                    <img 
                        src={editSvg} 
                        alt="Edit icon"
                        onClick={editTitle}
                    />  
                </h1>  
            </Link>

            <div className="tasks__items">
                {!withoutEmpty && list.tasks && !list.tasks.length && <h2>Задачи отсутствуют</h2>}

                {list.tasks && list.tasks.map(task => (
                    <Task 
                        key={task.id} 
                        list={list} 
                        {...task} 
                        onRemove={onRemoveTask}
                        onEdit={onEditTask}
                        onComplete={onCompleteTask}
                    />
                ))}

            </div>    

            <AddTaskForm key={list.id} list={list} onAddTask={onAddTask}/>    
        </div>
    )
}

export default Tasks;