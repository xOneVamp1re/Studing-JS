const input = document.querySelector('.github-search__input')
const autocompleteList = document.querySelector(
  '.github-search__autocomplete-list'
)
const repoList = document.querySelector('.github-search__repo-list')
const errorList = document.querySelector('.github-search__error-list')

let selectedRepos = []

function debounce(func, delay) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}
function showError({ message }) {
  const errorMessage = document.createElement('li')
  errorMessage.className = 'error-message'
  errorMessage.textContent = message
  errorMessage.style.margin = '20px 0'
  errorList.appendChild(errorMessage)
  setTimeout(() => {
    errorMessage.remove()
  }, 5000)
}
async function fetchRepos(text) {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${text}&per_page=5`
    )
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data.items || []
  } catch (error) {
    showError(error)
    return []
  }
}

const createRepoInfo = (
  item,
  { stargazers_count: stars, name, owner: { login } }
) => {
  const fragment = document.createDocumentFragment()
  const info = document.createElement('div')
  info.classList.add('github-search__repo-list-item-info')
  const nameEl = document.createElement('div')
  nameEl.classList.add('github-search__repo-list-item-name')
  nameEl.textContent = `Name: ${name}`
  const ownerEl = document.createElement('div')
  ownerEl.classList.add('github-search__repo-list-item-owner')
  ownerEl.textContent = `Owner: ${login}`
  const starsEl = document.createElement('div')
  starsEl.classList.add('github-search__repo-list-item-stars')
  starsEl.textContent = `Stars: ${stars}`
  fragment.appendChild(nameEl)
  fragment.appendChild(ownerEl)
  fragment.appendChild(starsEl)
  info.appendChild(fragment)
  item.appendChild(info)
}

const createRepoBtn = (item, { id }) => {
  const button = document.createElement('button')
  button.classList.add('remove-button')
  button.style.width = '40px'
  button.style.height = '40px'
  button.style.backgroundColor = 'transparent'
  button.style.position = 'relative'
  button.style.alignSelf = 'center'
  button.style.padding = '20px'

  const line1 = document.createElement('div')
  line1.style.position = 'absolute'
  line1.style.width = '4px'
  line1.style.height = '40px'
  line1.style.backgroundColor = 'red'
  line1.style.top = '0'
  line1.style.left = '50%'
  line1.style.transform = 'translateX(-50%) rotate(45deg)'
  line1.style.pointerEvents = 'none'
  const line2 = document.createElement('div')
  line2.style.position = 'absolute'
  line2.style.width = '4px'
  line2.style.height = '40px'
  line2.style.backgroundColor = 'red'
  line2.style.top = '0'
  line2.style.left = '50%'
  line2.style.transform = 'translateX(-50%) rotate(-45deg)'
  line2.style.pointerEvents = 'none'

  button.appendChild(line1)
  button.appendChild(line2)
  button.setAttribute('repo-id', id)
  button.addEventListener('click', (e) => {
    const repoId = e.target.getAttribute('repo-id')
    removeRepo(repoId)
  })
  item.appendChild(button)
}

const selectRepo = (repo) => {
  selectedRepos.push(repo)
  updateRepoList()
  input.value = ''
  autocompleteList.replaceChildren()
}

function updateRepoList() {
  repoList.innerHTML = ''
  const fragment = document.createDocumentFragment()
  selectedRepos.forEach((repo) => {
    const item = document.createElement('li')
    item.classList.add('github-search__repo-list-item')

    createRepoInfo(item, repo)
    createRepoBtn(item, repo)
    item.style.border = '1px solid #212534'
    item.style.backgroundColor = '#373a48'
    fragment.appendChild(item)
  })
  repoList.appendChild(fragment)
}

function removeRepo(repoId) {
  const id = parseInt(repoId)
  selectedRepos = selectedRepos.filter((repo) => repo.id !== id)
  updateRepoList()
}

const createAutoCompleteList = (repos) => {
  autocompleteList.replaceChildren()
  if (repos.length === 0) {
    const noResults = document.createElement('div')
    noResults.textContent = 'Нет результатов'
    noResults.style.margin = '20px 0'
    autocompleteList.appendChild(noResults)
    return
  }
  const fragment = document.createDocumentFragment()
  repos.forEach((repo) => {
    const item = document.createElement('div')
    item.classList.add('github-search__autocomplete-list-item')
    item.textContent = repo.name
    item.onclick = () => selectRepo(repo)
    fragment.appendChild(item)
  })
  autocompleteList.appendChild(fragment)
}

input.addEventListener(
  'input',
  debounce(async () => {
    const text = input.value.trim()
    if (text) {
      showLoading()
      const repos = await fetchRepos(text)
      createAutoCompleteList(repos)
    } else autocompleteList.innerHTML = ''
  }, 500)
)

function showLoading() {
  autocompleteList.innerHTML = '<div>Загрузка...</div>'
}
