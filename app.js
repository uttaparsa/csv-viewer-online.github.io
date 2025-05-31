const inputFile = document.getElementById('input-file')
const inputUrl = document.getElementById('input-url')
const loadUrlButton = document.getElementById('load-url-button')
const handsontableContainer = document.getElementById('handsontable-container')
const inputContainer = document.getElementById('input-container')

function displayCsvData(csvString, sourceUrl = null) {
  const data = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true
  })

  // reset container
  handsontableContainer.innerHTML = ''
  handsontableContainer.className = ''
  inputContainer.style.display = 'none'
  
  // Update URL with query parameter if loaded from URL
  if (sourceUrl) {
    const url = new URL(window.location)
    url.searchParams.set('csvUrl', sourceUrl)
    window.history.replaceState({}, '', url)
  }
  
  Handsontable(handsontableContainer, {
    data: data.data,
    rowHeaders: true,
    colHeaders: data.meta.fields,
    columnSorting: true,
    width: '100%',
    licenseKey: 'non-commercial-and-evaluation',
  })
}

inputFile.onchange = function () {
  const file = this.files[0]
  const reader = new FileReader()

  reader.onload = function (e) {
    displayCsvData(e.target.result)
  }

  file && reader.readAsText(file)
}

loadUrlButton.onclick = function () {
  const url = inputUrl.value.trim()
  if (!url) {
    alert('Please enter a URL')
    return
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.text()
    })
    .then(csvText => {
      displayCsvData(csvText, url)
    })
    .catch(error => {
      console.error('Error fetching from URL:', error)
      alert('Failed to load CSV from URL: ' + error.message)
    })
}

// Check for URL parameter on page load
function loadFromUrlParam() {
  const urlParams = new URLSearchParams(window.location.search)
  const csvUrl = urlParams.get('csvUrl')
  
  if (csvUrl) {
    inputUrl.value = csvUrl
    fetch(csvUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then(csvText => {
        displayCsvData(csvText, csvUrl)
      })
      .catch(error => {
        console.error('Error loading from URL parameter:', error)
        alert('Failed to load CSV from shared URL: ' + error.message)
      })
  }
}

// Load from URL parameter when page loads
loadFromUrlParam()
