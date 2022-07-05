const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");


const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter =document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListener();

function checkTodosIfExists(newTodo) {
    if (getTodosFromStorage().indexOf(newTodo)===-1) {
        return false;
    }
    return true;
}

function eventListener() {//Tüm event listenerlar 
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAlltodostoUI());
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}
function clearAllTodos() {
    if (confirm("Tümünü silmek istediğinizden emin misiniz? LOCAL")) {
        /* localStorage.clear();
        setTimeout(loadAlltodostoUI(),1000); */

        while (todoList.firstElementChild !=null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.clear();
    }

}
function filterTodos(e) {
    const filterValue=e.target.value.toLowerCase();
    const listItems=document.querySelectorAll(".list-group-item")
    listItems.forEach(function(listItem) {
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            //bulamadı

            listItem.setAttribute("style", "display : none !important"); //gizle !important katı. d-flex yapısının display özelliğini ezer.

        }else{
            listItem.setAttribute("style","display : block"); //göster
        }
    });
}
function deleteTodo(e) {
    if (e.target.className==="fa fa-remove") {
        const deletedTodo=e.target.parentElement.parentElement.textContent;
        deleteTodoFromStorage(deletedTodo);
        console.log(deletedTodo);
        e.target.parentElement.parentElement.remove();
        showAlert("success","Todo başarıyla silindi.");
    }
}
function deleteTodoFromStorage(deleteTodo) {
    let todos=getTodosFromStorage();
    todos.forEach(function(todo,index) {
        if (todo===deleteTodo) {
            todos.splice(index,1);
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
    
}
function loadAlltodostoUI() {
    let todos=getTodosFromStorage();

    todos.forEach(function(todo) {
        addTodoUI(todo);
    })
}
function addTodo(e) {
    const newTodo=todoInput.value.trim();
    if (newTodo==="") {
        showAlert("danger","lütfen bir todo giriniz.");
    }else if(checkTodosIfExists(newTodo)){
        showAlert("warning","Böyle bir todo zaten mevcut.")
    }
    else{
        addTodoUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","Eklendi.")
    }
    
    e.preventDefault();
}
function getTodosFromStorage() {//Storage'dan tüm todolaro çeker.
    let todos;
    if (localStorage.getItem("todos")===null) {
        todos=[];
    } else {
        todos=JSON.parse(localStorage.getItem("todos"));
    }

    return todos;
    
}
function addTodoToStorage(newTodo) { //Local storage'a todo ekler.
    let todos=getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}
function showAlert(type,message) {
    const alert=document.createElement("div");
    alert.className=`alert alert-${type}`;
    alert.textContent=message;
    firstCardBody.append(alert);
    //setTimeout-ilk parametre fonksiyon ikinci parametre kaç saniye(ms) sonra fonskiyonun işleneceği.
    setTimeout(function() {
        alert.remove();
    },1000);
}
function addTodoUI(newTodo) {//String değerini list item olarak ekleyecek
    //List item oluşturma
    const listItem=document.createElement("li");
    //link oluşturma
    const link =document.createElement("a");
    link.href="#";
    link.className="delete-item";
    link.innerHTML="<i class = 'fa fa-remove'></i>";

    listItem.className="list-group-item d-flex justify-content-between";
    //Text-node ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    //Todo list'e List item'ı ekleme
    todoList.appendChild(listItem);
    //imput textini temizleme
    todoInput.value="";
}