/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/getRepo.js":
/*!***************************!*\
  !*** ./src/js/getRepo.js ***!
  \***************************/
/***/ (() => {

const input = document.querySelector('.github-search__input');
const autocompleteList = document.querySelector('.github-search__autocomplete-list');
const repoList = document.querySelector('.github-search__repo-list');
const errorList = document.querySelector('.github-search__error-list');
let selectedRepos = [];
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
function showError({
  message
}) {
  const errorMessage = document.createElement('li');
  errorMessage.className = 'error-message';
  errorMessage.textContent = message;
  errorMessage.style.margin = '20px 0';
  errorList.append(errorMessage);
  setTimeout(() => {
    errorMessage.remove();
  }, 5000);
}
async function fetchRepos(text) {
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${text}&per_page=5`);
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    showError(error);
    return [];
  }
}
const createRepoInfo = (item, {
  stargazers_count: stars,
  name,
  owner: {
    login
  }
}) => {
  const fragment = document.createDocumentFragment();
  const info = document.createElement('div');
  info.classList.add('github-search__repo-list-item-info');
  const nameEl = document.createElement('div');
  nameEl.classList.add('github-search__repo-list-item-name');
  nameEl.textContent = `Name: ${name}`;
  const ownerEl = document.createElement('div');
  ownerEl.classList.add('github-search__repo-list-item-owner');
  ownerEl.textContent = `Owner: ${login}`;
  const starsEl = document.createElement('div');
  starsEl.classList.add('github-search__repo-list-item-stars');
  starsEl.textContent = `Stars: ${stars}`;
  info.append(nameEl, ownerEl, starsEl);
  fragment.append(info);
  item.append(fragment);
};
const createRepoBtn = (item, {
  id
}) => {
  const button = document.createElement('button');
  button.classList.add('remove-button');
  button.style.width = '40px';
  button.style.height = '40px';
  button.style.backgroundColor = 'transparent';
  button.style.position = 'relative';
  button.style.alignSelf = 'center';
  button.style.padding = '20px';
  const line1 = document.createElement('div');
  line1.style.position = 'absolute';
  line1.style.width = '4px';
  line1.style.height = '40px';
  line1.style.backgroundColor = 'red';
  line1.style.top = '0';
  line1.style.left = '50%';
  line1.style.transform = 'translateX(-50%) rotate(45deg)';
  line1.style.pointerEvents = 'none';
  const line2 = document.createElement('div');
  line2.style.position = 'absolute';
  line2.style.width = '4px';
  line2.style.height = '40px';
  line2.style.backgroundColor = 'red';
  line2.style.top = '0';
  line2.style.left = '50%';
  line2.style.transform = 'translateX(-50%) rotate(-45deg)';
  line2.style.pointerEvents = 'none';
  button.append(line1, line2);
  button.setAttribute('data-id', id);
  button.addEventListener('click', e => {
    const repoId = e.target.getAttribute('data-id');
    removeRepo(repoId);
  });
  item.append(button);
};
const selectRepo = repo => {
  selectedRepos.push(repo);
  updateRepoList();
  input.value = '';
  autocompleteList.replaceChildren();
};
function updateRepoList() {
  repoList.innerHTML = '';
  const fragment = document.createDocumentFragment();
  selectedRepos.forEach(repo => {
    const item = document.createElement('li');
    item.classList.add('github-search__repo-list-item');
    createRepoInfo(item, repo);
    createRepoBtn(item, repo);
    item.style.border = '1px solid #212534';
    item.style.backgroundColor = '#373a48';
    fragment.append(item);
  });
  repoList.append(fragment);
}
function removeRepo(repoId) {
  const id = parseInt(repoId);
  selectedRepos = selectedRepos.filter(repo => repo.id !== id);
  updateRepoList();
}
const createAutoCompleteList = repos => {
  autocompleteList.replaceChildren();
  if (repos.length === 0) {
    const noResults = document.createElement('div');
    noResults.textContent = 'Нет результатов';
    noResults.style.margin = '20px 0';
    autocompleteList.append(noResults);
    return;
  }
  const fragment = document.createDocumentFragment();
  repos.forEach(repo => {
    const item = document.createElement('li');
    item.classList.add('github-search__autocomplete-list-item');
    item.textContent = repo.name;
    item.onclick = () => selectRepo(repo);
    fragment.append(item);
  });
  autocompleteList.append(fragment);
};
input.addEventListener('input', debounce(async () => {
  const text = input.value.trim();
  if (text) {
    showLoading();
    const repos = await fetchRepos(text);
    createAutoCompleteList(repos);
  } else autocompleteList.innerHTML = '';
}, 500));
function showLoading() {
  autocompleteList.innerHTML = '<div>Загрузка...</div>';
}

/***/ }),

/***/ "./src/index.html":
/*!************************!*\
  !*** ./src/index.html ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <title>GitHub Search</title>
    <style></style>
  </head>
  <body>
    <div class="container"
      ><section class="github-search">
        <h1 class="github-search__title">Поиск репозиториев GitHub</h1>
        <input
          class="github-search__input"
          type="text"
          placeholder="Введите название репозитория"
        />
        <ul class="github-search__autocomplete-list"></ul>
        <ul class="github-search__repo-list"></ul>
        <ul class="github-search__error-list"></ul> </section
    ></div>
  </body>
</html>
`;
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ "./src/styles/style.scss":
/*!*******************************!*\
  !*** ./src/styles/style.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.html */ "./src/index.html");
/* harmony import */ var _styles_style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/style.scss */ "./src/styles/style.scss");
/* harmony import */ var _js_getRepo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/getRepo */ "./src/js/getRepo.js");
/* harmony import */ var _js_getRepo__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_js_getRepo__WEBPACK_IMPORTED_MODULE_2__);




})();

/******/ })()
;
//# sourceMappingURL=main.1311b6c626d730f18f2b.js.map