'use-strict';
let mode_checkbox = document.getElementById('mode_checkbox');

//Set document theme/mode automatically
function set_mode(event) {
  if (event.target.checked) {
    set_dark_mode();
    chrome.storage.sync.set({ mode: 'dark' });
  } else {
    set_light_mode();
    chrome.storage.sync.set({ mode: 'light' });
  }
}

//Set root CSS variables for dark mode
function set_dark_mode() {
  let root = document.querySelector(':root');
  root.style.setProperty('--background', '#2d2d2d');
  root.style.setProperty('--foreground', '#393939');
  root.style.setProperty('--color', '#d7d9db');
}

//Set root CSS variables for light mode
function set_light_mode() {
  let root = document.querySelector(':root');
  root.style.setProperty('--background', 'aliceblue');
  root.style.setProperty('--foreground', 'rgb(172, 169, 169)');
  root.style.setProperty('--color', 'black');
}

//Attach event listeners
mode_checkbox.addEventListener('change', set_mode);

//Synchronize page mode and mode checkbox state
chrome.storage.sync.get('mode', function (data) {
  if (data.mode == 'dark') {
    set_dark_mode();
    document.getElementById('mode_checkbox').setAttribute('checked', true);
  }
});

let select_form = document.getElementById('select_form');

function show_copy_buttons() {
  let toggled_buttons = document.querySelector('.toggled-button-list'),
    target = document.getElementById(this.value);
  if (toggled_buttons !== null) {
    toggled_buttons.className = 'button-list';
  }
  if (target !== null) {
    target.className = 'toggled-button-list ';
  }
}

function attach_copy_buttons() {
  const copy_btns = document.getElementsByClassName('copy-button');

  for (let i = 0; i < copy_btns.length; i++) {
    copy_btns[i].addEventListener('click', function (event) {
      let text_to_copy = event.target.textContent;
      navigator.clipboard.writeText(text_to_copy);
    });
  }
}

function display_button_lists(data) {
  for (let lang in data) {
    let lang_name = lang.toLowerCase();
    if (lang_name === 'recently used') {
      display_option('Choose Category');
    } else {
      display_option(lang_name);
      let lang_div = document.createElement('div');
      lang_div.className = 'button-list';
      lang_div.id = lang_name;
      lang_div.innerHTML += `
          ${data[lang]
            .map((text) => `<button class="copy-button">${text}</button>`)
            .join(' ')}
      `;
      document.getElementById('button_lists').appendChild(lang_div);
    }
  }
}
function display_option(lang_name) {
  let lang_option = document.createElement('option');
  lang_option.value = lang_name;
  lang_option.innerText = lang_name;
  select_form.appendChild(lang_option);
}

fetch(chrome.runtime.getURL('./accents.json'))
  .then((response) => response.json())
  .then((data) => display_button_lists(data))
  .then(() => attach_copy_buttons());

select_form.addEventListener('change', show_copy_buttons);
