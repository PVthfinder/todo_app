import React from 'react';
import classNames from 'classnames';
import axios from 'axios';

import Badge from '../Badge';

import removeSvg from '../../assets/images/remove.svg';

import './List.scss';

const List = ({items, isRemovable, onClick, onRemove, onClickList, activeItem}) => {
    const removeList = item => {
        if(window.confirm('Вы действительно хотите удалить список?')) {
            axios.delete('http://localhost:3001/lists/' + item.id)
            .then(() => {
                onRemove(item.id);
            });
        }
    }

    return (
        <ul onClick={onClick} className="list">
            {items.map((item, index) => (
                <li 
                    key={index} 
                    className={
                        classNames(
                            item.className, 
                            {active : item.active ? item.active : activeItem && activeItem.id === item.id}
                        )
                    }
                    onClick={onClickList ? () => onClickList(item) : null}
                >

                    <i>{item.icon ? item.icon : <Badge color={item.color.name}/>}</i>
                    <span>{item.name}</span>
                    {item.tasks && ` (${item.tasks.length})`}
                    {isRemovable && <img 
                        className="list__remove-icon" 
                        src={removeSvg} 
                        alt="Remove icon"
                        onClick={() => removeList(item)}    
                    />}

                </li>
            ))}
        </ul>
    );
};

export default List;