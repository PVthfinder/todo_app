import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Badge from '../Badge';
import List from '../List';

import './AddList.scss';

const AddListButton = ({colors, onAdd}) => {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColor, selectColor] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (Array.isArray(colors)) {
            selectColor(colors[0].id);
        }
    }, [colors])

    const addList = () => {
        if (!inputValue) {
            alert('Введите название!');
            return;
        }
        setIsLoading(true); 
        axios
            .post('http://localhost:3001/lists', {name: inputValue, colorId: selectedColor})
            .then(({data}) => {
                const color = colors.find(color => color.id === selectedColor);
                const newListObj = {...data, color, tasks: []};
                onAdd(newListObj);
                setVisiblePopup(false);
                setInputValue('');
                selectColor(colors[0].id);                
            })
            .catch(() => {
                alert('Неудачная попытка добавления списка!')
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (

        <div className="add-list">
            <List
                onClick={() => setVisiblePopup(!visiblePopup)}
                items = {[
                    {
                    className: "list__add-button",
                    icon: "+",
                    name: "Добавить список"
                    }
                ]}
            />

            {visiblePopup && <div className="add-list__popup">
                <input 
                    className="field" 
                    type="text" 
                    placeholder="Название списка"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)} 
                />
                <div className="add-list__popup-colors">
                    {colors.map(color => (
                        <Badge 
                            key={color.id} 
                            onClick={() => selectColor(color.id)} 
                            color={color.name}
                            className={selectedColor === color.id && 'active'}
                        />
                    ))}
                </div>
                <button className="button" onClick={addList}>
                    {isLoading ? 'Добавление...' : 'Добавить'}
                </button>
            </div>}
        </div>
    )
}
export default AddListButton;