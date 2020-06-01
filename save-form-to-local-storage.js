const getFormId = form => form.getAttribute('data-form-id');

const getAllForms = () => document.querySelectorAll('form');

const saveDefault = (target, data) => {
    const { id, value, name } = target;
    const fieldset = target.closest('fieldset');

    if (fieldset) {
        if (fieldset.id) {
            if (data[fieldset.id]) {
                data[fieldset.id][name] = value
            } else {
                data[fieldset.id] = { [name]: value };
            }
        }
    } else {
        data[id] = value;
    }
};

const saveCheckbox = (target, data) => {
    const { value, checked } = target;
    const fieldset = target.closest('fieldset');

    if (fieldset && fieldset.id) {
        if (!data[fieldset.id]) {
            data[fieldset.id] = [];
        }

        data[fieldset.id] = data[fieldset.id].filter(it => it !== value);

        if (checked) {
            data[fieldset.id].push(value);
        }
    }
};

const saveRadio = (target, data) => {
    const { value } = target;
    const fieldset = target.closest('fieldset');

    if (fieldset && fieldset.id) {
        data[fieldset.id] = value;
    }
};

const saveSelect = (target, data) => {
    const { id, value } = target;

    data[id] = value;
};

const restoreDefault = (element, data) => {
    if (!element.id && element.name) {
        const fieldset = element.closest('fieldset');

        if (fieldset && data[fieldset.id]) {
            const value = data[fieldset.id][element.name];

            if (value) {
                element.value = value;
            }
        }
    } else {
        const value = data[element.id];

        if (value) {
            element.value = value;
        }
    }
};

const restoreCheckbox = (element, data) => {
    const fieldset = element.closest('fieldset');

    if (fieldset && data[fieldset.id]) {
        const value = data[fieldset.id].find(it => it === element.value);

        if (value) {
            element.checked = true;
        }
    }
};

const restoreRadio = (element, data) => {
    const fieldset = element.closest('fieldset');

    if (fieldset && data[fieldset.id]) {
        const value = data[fieldset.id];

        if (value && element.value === value) {
            element.checked = true;
        }
    }
};

const restoreSelect = (element, data) => {
    const value = data[element.id];

    if (value) {
        element.value = value;
    }
};

const restoreElement = (element, data) => {
    if (element.name.includes('checkbox')) {
        return restoreCheckbox(element, data);
    }

    if (element.name.includes('radio')) {
        return restoreRadio(element, data);
    }

    if (element.name.includes('select')) {
        return restoreSelect(element, data);
    }

    return restoreDefault(element, data);
};

const saveElement = (target, formData) => {
    if (target.name.includes('checkbox')) {
        return saveCheckbox(target, formData);
    }

    if (target.name.includes('radio')) {
        return saveRadio(target, formData);
    }

    if (target.name.includes('select')) {
        return saveSelect(target, formData);
    }

    return saveDefault(target, formData);
};

const formEventHandler = ({ target }) => {
    const form = target.closest('form');

    if(!form) {
        return;
    }

    const formId = getFormId(form);
    let formData = JSON.parse(localStorage.getItem(formId));

    if (!formData) {
        formData = {};
    }

    saveElement(target, formData);

    localStorage.setItem(formId, JSON.stringify(formData));
};

const restoreForm = () => {
    getAllForms().forEach(it => {
        const formId = getFormId(it);
        const data = JSON.parse(localStorage.getItem(formId));

        it.addEventListener('change', formEventHandler);


        if (data) {
            for (const element of it.elements) {
                restoreElement(element, data);
            }
        }
    });
};

window.onload = () => {
    document.querySelectorAll('button.lightbox-handle').forEach(it => it.addEventListener('click', restoreForm));

    restoreForm();
};
