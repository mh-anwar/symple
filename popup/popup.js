function show_copy_buttons() {
  let toggled_buttons = document.querySelector('.toggled-button-div'),
    target = document.getElementById(this.value);
  if (toggled_buttons !== null) {
    toggled_buttons.className = 'button-list';
    recent_button_container.style.display = 'flex';
  }
  if (target !== null) {
    target.className = 'toggled-button-div ';
    recent_button_container.style.display = 'none';
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

function populate_dropdowns() {
  fetch(chrome.runtime.getURL('./accents.json'))
    .then((response) => response.json())
    .then((data) => {
      for (let lang in data) {
        let lang_div = document.getElementById(lang.toLowerCase());
        lang_div.innerHTML += `
          ${data[lang]
            .map((text) => `<button class="copy-button">${text}</button>`)
            .join(' ')}
      `;
      }
    })
    .then(() => attach_copy_buttons());
}

function show_recently_used(data) {
  //Get recently used buttons and insert them into DOM
  document.getElementById('recently_used').innerHTML = data.recently_used
    .map((text) => `<button class="copy-button">${text}</button>`)
    .join(' ');
}

function set_dark_mode() {
  let root = document.querySelector(':root');
  root.style.setProperty('--back', '#000509');
  root.style.setProperty('--fore', '#0d1117');
  root.style.setProperty('--color', '#c2cad2');
}
select_form.addEventListener('change', show_copy_buttons);
options_button.addEventListener('click', open_options);
populate_dropdowns();

chrome.storage.sync.get('recently_used', show_recently_used);
chrome.storage.sync.get('mode', function (data) {
  if (data.mode == 'dark') {
    set_dark_mode();
    document.body.classList.add('dark-mode__page');
  }
});
