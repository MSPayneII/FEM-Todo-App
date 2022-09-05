import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { sunIcon, moonIcon, crossIcon, checkIcon } from "./images";
import ListViewBtns from "./components/ListViewBtns/ListViewBtns";
import "./index.css";
import { elementRoles } from "aria-query";

const element = document.querySelector("body");
let localDarkMode = localStorage.getItem("dark-mode");

const getLocalStorage = () => {
  let list = localStorage.getItem("list");

  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [item, setItem] = useState("");
  const [toDoList, setToDoList] = useState(getLocalStorage);
  const [showAllItems, setShowAllItems] = useState(true);
  const [showActiveItems, setShowActiveItems] = useState(false);
  const [showCompletedItems, setShowCompletedItems] = useState(false);
  const [activeList, setActiveList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [isDarkMode, setisDarkMode] = useState(false);

  const updateItem = (id) => {
    const specificItem = toDoList.find((item) => item.id === id);
    specificItem.completed = !specificItem.completed;
    setToDoList([...toDoList]);
  };

  const deleteItem = (id) => {
    const newToDoList = toDoList.filter((item) => item.id !== id);
    const newActiveList = activeList.filter((item) => item.id !== id);
    const newCompletedList = completedList.filter((item) => item.id !== id);

    setToDoList(newToDoList);
    setActiveList(newActiveList);
    setCompletedList(newCompletedList);
  };

  const enableDarkMode = () => {
    element.classList.add("dark-mode");
    setisDarkMode(true);
  };
  const disableDarkMode = () => {
    element.classList.remove("dark-mode");
    setisDarkMode(false);
  };

  const setTheme = () => {
    const icon = document.querySelector(".theme-icon");
    localDarkMode = localStorage.getItem("dark-mode");

    if (localDarkMode === "disabled") {
      localStorage.setItem("dark-mode", "enabled");
      enableDarkMode();
      icon.src = sunIcon;
      // console.log(`in set theme: enabled`);
      return;
    } else if (localDarkMode === "enabled") {
      localStorage.setItem("dark-mode", "disabled");
      disableDarkMode();
      icon.src = moonIcon;
      // console.log(`in set theme: disabled`);
      return;
    } else {
      localStorage.setItem("dark-mode", "enabled");
      enableDarkMode();
    }
  };

  const getPreferredTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark").matches) {
      return true;
    } else {
      return false;
    }
  };

  const systemThemeCheck = (storageValue) => {
    if (!localDarkMode && getPreferredTheme()) {
      enableDarkMode();
    } else if (!localDarkMode && !getPreferredTheme()) {
      disableDarkMode();
    } else if (localDarkMode === "enabled") {
      enableDarkMode();
    } else if (localDarkMode === "disabled") {
      disableDarkMode();
    }
  };

  const activeCount = (toDoList) => {
    let count = 0;
    for (let i = 0; i < toDoList.length; i++) {
      if (toDoList[i].completed === false) {
        count++;
      }
    }
    return count;
  };

  const showAll = () => {
    setShowAllItems(true);
    setShowActiveItems(false);
    setShowCompletedItems(false);
    setToDoList([...toDoList]);
  };

  const showActive = () => {
    setShowActiveItems(true);
    setShowCompletedItems(false);
    setShowAllItems(false);
    setActiveList(toDoList.filter((item) => !item.completed));
  };

  const showCompleted = () => {
    setShowCompletedItems(true);
    setShowActiveItems(false);
    setShowAllItems(false);
    setCompletedList(toDoList.filter((item) => item.completed));
  };

  const clearCompletedItems = () => {
    setCompletedList([]);
    setToDoList(toDoList.filter((item) => !item.completed));
    setActiveList(toDoList.filter((item) => !item.completed));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (showAllItems) {
      const items = [...toDoList];
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setToDoList(items);
    }

    if (showActiveItems) {
      const items = [...activeList];
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setActiveList(items);
    }

    if (showCompletedItems) {
      const items = [...completedList];
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setCompletedList(items);
    }
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(toDoList));
    localDarkMode = localStorage.getItem("dark-mode");

    systemThemeCheck(localDarkMode);

    let schemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    // console.log(schemeQuery);
    schemeQuery.addEventListener("change", systemThemeCheck);

    return () => schemeQuery.removeEventListener("change", systemThemeCheck);
  }, [toDoList]);

  // getPreferredTheme();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (item) {
      const newItem = {
        id: new Date().getTime().toString(),
        title: item,
        completed: false,
      };
      setToDoList([...toDoList, newItem]);
      setActiveList([...toDoList, newItem]);
      setItem("");
    }
  };

  let theList = [];

  if (showAllItems) {
    theList = toDoList;
  }

  if (showActiveItems) {
    theList = activeList;
  }

  if (showCompletedItems) {
    theList = completedList;
  }

  return (
    <main className="main">
      <div className="background-image"></div>
      <div className="logo-theme">
        <h1 className="logo">Todo</h1>
        <button className="theme-btn" onClick={setTheme}>
          <img
            src={isDarkMode ? sunIcon : moonIcon}
            alt="theme icon"
            className="theme-icon"
          />
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="todo-input"></label>
        <button className="check-circle-btn">
          {/* <img src={checkIcon} alt="check icon" /> */}
        </button>
        <input
          type="text"
          className="todo-input"
          name="todo-input"
          placeholder="Create a new todo..."
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
      </form>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todo-list">
          {(provided) => (
            <ul
              className="todo-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {theList.map((item, index) => {
                const { id, title, completed } = item;
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <li
                        className="todo-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="check-circle-text">
                          <button
                            className={
                              completed
                                ? "check-circle-btn completed"
                                : "check-circle-btn"
                            }
                            onClick={() => updateItem(id)}
                          >
                            {completed && (
                              <img
                                src={checkIcon}
                                alt="check icon"
                                className="checkIcon"
                              />
                            )}
                          </button>

                          <p
                            className={
                              completed
                                ? "todo-item-text text-strikeout"
                                : "todo-item-text"
                            }
                          >
                            {title}
                          </p>
                        </div>
                        <img
                          src={crossIcon}
                          alt="delete-btn"
                          className="delete-btn"
                          onClick={() => deleteItem(id)}
                        />
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}

              <div className="list-info-clear">
                <p className="items-left-count">
                  {activeCount(toDoList)} items left
                </p>

                <ListViewBtns
                  className={"list-view-lg"}
                  showAllItems={showAllItems}
                  showAll={showAll}
                  showActiveItems={showActiveItems}
                  showActive={showActive}
                  showCompletedItems={showCompletedItems}
                  showCompleted={showCompleted}
                />

                <button
                  className="clear-completed-btn"
                  onClick={clearCompletedItems}
                >
                  Clear Completed
                </button>
              </div>
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <ListViewBtns
        className={"list-view-mobile"}
        showAllItems={showAllItems}
        showAll={showAll}
        showActiveItems={showActiveItems}
        showActive={showActive}
        showCompletedItems={showCompletedItems}
        showCompleted={showCompleted}
      />

      <p className="user-instructions">Drag and drop to reorder list</p>
    </main>
  );
}

export default App;
