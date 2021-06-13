import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Route, useHistory, useLocation} from 'react-router-dom';

import {AddList, List, Tasks} from './components';

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  let locaton = useLocation();
  let history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({data}) => {setLists(data)});
    axios.get('http://localhost:3001/colors').then(({data}) => {setColors(data)});
  },[]);

  const onAddList = obj => {
    const newLists = [...lists,obj];
    setLists(newLists);
  }

  const onAddTask = (listId, taskObj) => {
    const newLists = lists.map(item => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj]
      }
      return item;
    });
    setLists(newLists);
  }

  const onRemoveTask = (listId, taskId) => {
      if(window.confirm('Вы действительно хотите удалить задачу?')) {
        const newLists = lists.map(item => {
          if (item.id === listId) {
            item.tasks = item.tasks.filter(task => task.id !== taskId);
          }
          return item;
        });
        setLists(newLists);

        axios
            .delete('http://localhost:3001/tasks/' + taskId)
            .catch(() => {
                alert('Не удалось уалить задачу!')
            })
      }
  }

  const onEditTask = (listId, taskObj) => {
      const newTaskText = window.prompt('Введите тескт новой задачи', taskObj.text);

      if (!newTaskText) {
        return;
      }

      const newLists = lists.map(list => {
        if (list.id === listId) {
          list.tasks = list.tasks.map(task => {
            if (task.id === taskObj.id) {
              task.text = newTaskText;
            }
            return task;
          })
        }
        return list;
      });
      setLists(newLists);
      axios
        .patch('http://localhost:3001/tasks/' + taskObj.id, {text: newTaskText})
        .catch(() => {alert('Не удалось поменять тескт задачи!')})
  }

  const onCompleteTask = (listId, taskId, completed) => {
      const newLists = lists.map(list => {
        if (list.id === listId) {
          list.tasks = list.tasks.map(task => {
            if (task.id === taskId) {
              task.completed = completed;
            }
            return task;
          })
        }
        return list;
      });
      setLists(newLists);
      axios
        .patch('http://localhost:3001/tasks/' + taskId, {completed})
        .catch(() => {'Не удалось обновить задачу!'})
  }

  const onEditListTitle = (id, title) => {
    const newLists = lists.map(item => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newLists);
  }

  useEffect(() => {
    const pathArr = history.location.pathname.split('/');
    const listId = pathArr[pathArr.length - 1];
    if (lists) {
      const list = lists.find(list => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, history.location.pathname]);

  return (
    <div className="todo">
      
      <div className="todo__sidebar">
        <List 
          items = {[
            {
              active: history.location.pathname === '/',              
              icon: "-",
              name: "Все задачи"
            }
          ]}
          onClickList={list => {
            history.push(`/`);
          }}
        />

        {lists ? (
          <List 
            items = {lists}
            isRemovable
            onRemove = {id => {
              const newLists = lists.filter(list => list.id !== id);
              setLists(newLists);
            }}
            onClickList={list => {
              history.push(`/lists/${list.id}`);
            }}
            activeItem={activeItem}
          />
        ) : (
          'Загрузка...'
        )}

        <AddList
          colors={colors}
          onAdd = {onAddList}
        />
      </div>

      <div className="todo__tasks">
        <Route exact path="/">
          {lists && lists.map(list => (
            <Tasks 
              key={list.id}
              list={list}
              onEditTitle={onEditListTitle}
              onAddTask={onAddTask}
              withoutEmpty
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              onCompleteTask={onCompleteTask}
            />
          ))}
        </Route>

        <Route path="/lists/:id">
          {lists && 
          activeItem && 
          <Tasks 
            list={activeItem}
            onEditTitle={onEditListTitle}
            onAddTask={onAddTask}
            onRemoveTask={onRemoveTask}
            onEditTask={onEditTask}
            onCompleteTask={onCompleteTask}
          />}
        </Route>
      </div>
    </div>
  );
}

export default App;
