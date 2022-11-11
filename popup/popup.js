let select_form = document.getElementById('select_form');
let mode_option = document.getElementById('mode_option');
let mode = 0;
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
//Options is the same as settings
function open_options() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('../settings/settings.html'));
  }
}
//TODO fix this function
function add_recently_used(symbol) {
  chrome.storage.sync.get('recently_used', function (data) {
    if (recently_used.length > 10) {
      recently_used[-1].remove();
    }
    data.recently_used.push(symbol);
    chrome.storage.sync.set({ recently_used: data.recently_used });
  });
}

function attach_copy_buttons() {
  const copy_btns = document.getElementsByClassName('copy-button');

  for (let i = 0; i < copy_btns.length; i++) {
    copy_btns[i].addEventListener('click', function (event) {
      let text_to_copy = event.target.textContent;
      navigator.clipboard.writeText(text_to_copy);
      add_recently_used(text_to_copy);
      show_snackbar();
      if (autotype === true) {
        console.log('autotyping');
        autotype_symbol(event.target.textContent);
        console.log('Just autotyped');
      }
    });
  }
}

function show_snackbar() {
  let snackbar = document.getElementById('button_snackbar');
  snackbar.className = 'show';
  setTimeout(function () {
    snackbar.className = snackbar.className.replace('show', '');
  }, 3000);
}
function display_button_lists(data) {
  for (let lang in data) {
    let lang_name = lang.toLowerCase();
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
    //document.getElementById(lang.toLowerCase());
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

//Set document theme/mode automatically
function set_mode() {
  if (mode === 1) {
    set_dark_mode();
    chrome.storage.sync.set({ mode: 'dark' });
    mode = 0;
  } else {
    set_light_mode();
    chrome.storage.sync.set({ mode: 'light' });
    mode = 1;
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
  root.style.setProperty('--foreground', '#c5c8cc');
  root.style.setProperty('--color', 'black');
  root.style.setProperty('--primary', '  #c5c8cc');
}

chrome.storage.sync.get('mode', function (data) {
  if (data.mode === 'dark') {
    mode = 1;
  } else {
    mode = 0;
  }
  set_mode();
});
select_form.addEventListener('change', show_copy_buttons);
options_button.addEventListener('click', open_options);
mode_option.addEventListener('click', set_mode);
