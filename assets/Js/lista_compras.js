
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

/*====== EDIÇÃO DE OPÇÕES ======*/
let editElement;
let editFlag = false;
let editId = "";

/*====== ADD EVENTLISTNER ======*/
form.addEventListener('submit', addItem);
//Limpar itens
clearBtn.addEventListener('click', clearItems);
//Carregar itens
window.addEventListener('DOMContentLoaded', setupItems);



/*====== FUNÇÕES ======*/
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;

    const id = new Date().getTime().toLocaleString();
    if (value && !editFlag) {

        createListItem(id, value);
        // Disply alert
        displayAlert('Item adicionado!', "sucess");
        // Show container
        container.classList.add("show-container");
        // Add local storeg
        addToLocalStorege(id, value);
        // Set back to default
        setBackToDefault()

    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('Item editado!', 'sucess');
        // Edit local storage
        editLocalStorage(editId, value);
        setBackToDefault()
    }
    else {
        displayAlert('Insira um item!', "danger");
    }

}

/*====== DISPLAY ALERTA ======*/
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // Remover alerta
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);

    }, 1000);
}
/*====== LIMPAR ITENS ======*/
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');

    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    displayAlert("Insira uma lista!", "danger");
    setBackToDefault();
    localStorage.removeItem('list');
}

/*====== DELETAR FUNÇÃO ======*/
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert('Item retirado da lista', 'danger');
    setBackToDefault();
    //Remover local storage
    removeFromLocalStorage(id);
}
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // Definir item de edição
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // Definir valor do formulário
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = "editar";
}

/*====== VOLTAR AO PADRÃO ======*/
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "Incluir";


}


/*====== LOCAL STORAGE ======*/
function addToLocalStorege(id, value) {
    const grocery = { id, value };
    let items = getLocalStorage();

    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));

    /*console.log("adicionado local")*/

}
function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    })
    localStorage.setItem('list', JSON.stringify(items));
}
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}
function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem('list')) : [];
}



/*====== CONFIGURAÇÃO DOS ITENS ======*/
function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container')
    }
}

function createListItem(id, value) {
    const element = document.createElement('article');
    // Adicionando class
    element.classList.add('grocery-item');
    // Adicionando id 
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = ` <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    // Anexando filho
    list.appendChild(element);

}