// all target elements here
const formRoot = document.querySelector('#form-root');
const submitButton = document.querySelector('#submit');

const CELL_TYPE = {
    UPLOAD: "upload",
    SELECT: "select",
    CHECKBOX: "checkbox",
    RADIO: "radio"
}

var formStateData;

// TODO: get JSON data
async function getFormData() {
    const response = await fetch('../data/formData.json');
    const data = await response.json();
    formStateData = data;
    buildForm(data);
}
getFormData();

// TODO: build form here
function buildForm(formData) {
    const form = document.createElement('form');
    form.className = 'form-container'
    form.setAttribute('name', 'userForm');
    for (const fd of formData) {
        form.appendChild(getFormType(fd));
    };
    formRoot.appendChild(form);
}

// get common attribute
function getCommonAttribute(parentElement, formData) {
    for (const fd of Object.entries(formData)) {
        parentElement.setAttribute(fd[0], fd[1]);
    }
}

// TODO: get common form type 
function getFormType(formData) {
    const input = document.createElement('input');

    switch (formData.type) {
        case CELL_TYPE.UPLOAD:
            const md = {
                ...formData,
                type: 'file',
            }
            getCommonAttribute(input, md);
            return input;

        case CELL_TYPE.SELECT:
            const select = document.createElement('select');
            for (const fd of formData.options) {
                const option = document.createElement('option')
                const content = document.createTextNode(fd);
                option.appendChild(content);
                option.setAttribute('value', fd);
                select.setAttribute('name', formData.id);
                select.appendChild(option);
            }
            return select;

        case CELL_TYPE.CHECKBOX:
            const checkboxContainer = document.createElement('div');
            for (const fd of formData.options) {
                const md = {
                    ...formData,
                    type: CELL_TYPE.CHECKBOX,
                    name: formData.id
                }
                const checkBoxInput = document.createElement('input');
                const label = document.createElement('label');
                const content = document.createTextNode(fd);
                label.appendChild(content);
                checkboxContainer.appendChild(label);
                getCommonAttribute(checkBoxInput, md);
                checkBoxInput.value = fd;
                checkboxContainer.appendChild(checkBoxInput);
                checkboxContainer.className = 'cell-container'
            }
            return checkboxContainer;

        case CELL_TYPE.RADIO:
            const radionContainer = document.createElement('div');
            for (const fd of formData.options) {
                const md = {
                    type: formData.type,
                    name: formData.id,
                    value: fd,
                    id: fd
                }
                const checkBoxInput = document.createElement('input');
                const label = document.createElement('label');
                const content = document.createTextNode(fd);
                label.setAttribute('for', fd);
                label.appendChild(content);
                getCommonAttribute(checkBoxInput, md)
                radionContainer.appendChild(label);
                radionContainer.appendChild(checkBoxInput);
                radionContainer.className = 'cell-container'
            }
            return radionContainer;

        default:
            getCommonAttribute(input, formData);
            return input;;
    }
}

function resetError() {
    const deleteNodes = document.querySelectorAll('p');
    const formContainer = document.querySelector('.form-container');
    if (deleteNodes.length > 0) {
        for (const dn of deleteNodes) {
            formContainer.removeChild(dn);
        }
    }
}

// TODO: form validation here
function onHandleSubmit(e) {
    e.preventDefault();
    const data = {};
    resetError();
    for (const fd of formStateData) {
        if (fd.type == CELL_TYPE.CHECKBOX) {
            const checkboxes = document.getElementsByName("hobbies");
            const hobbies = [];
            for (const cb of checkboxes) {
                if (cb.checked) {
                    hobbies.push(cb.value);
                }

            }
            console.log("HB", hobbies)
            data[fd.id] = hobbies;
        } else {
            if (document.forms['userForm'][fd.id].value == "" && fd.validations[0]?.type == "required") {
                const n = document.querySelector(`#${fd.id}`);
                const p = document.createElement('p');
                const content = document.createTextNode(fd.validations[0]?.params[0]);
                p.appendChild(content);
                p.className = "error";
                n.insertAdjacentElement('afterend', p);
            };
            data[fd.id] = document.forms['userForm'][fd.id].value;
        }
        
    };
    showSuccessMessage(data);
}

// TODO: display success message
function showSuccessMessage(messageData) {
    const msg = [];
    for (const displayMessage of Object.entries(messageData)) {
        msg.push(`
           ${displayMessage[0]}: ${displayMessage[1]}
        `);
    }
    alert(`Form Successfully submitted
          ${msg.map(m => m).join(' ')}
    `);
}

submitButton.addEventListener('click', onHandleSubmit);