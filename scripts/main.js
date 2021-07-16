var myLibrary = [];
var filteredLibrary = [];
var cardsContainer;
var totalBooksSpan;
var currentlyReadingSpan;
var booksReadSpan;
var pagesReadSpan;
var bookForm;
var errorAlert;

var totalBooks = 0;
var currentlyReading = 0;
var booksRead = 0;
var pagesRead = 0;

function Book(title, author, pages, readPages, read, id, url) {
	this.title = title;
	this.author = author;
	this.pages = pages || 0;
	this.readPages = readPages || 0;
	this.read = read || false;
	this.id = id;
	this.url = url;
}

const addBookToLibrary = (title, author, pages, readPages, read, url) => {
	console.log(myLibrary.length);
	var book = new Book(title, author, pages, readPages, read, myLibrary.length, url);
	console.log(book);
	myLibrary.push(book);
	return book;
}

const runSearch = (e) => {
	var searchStr = document.querySelector('#searchbox').value;
	if (searchStr === '' || searchStr === null || searchStr === undefined) {
		filteredLibrary = [];
		initDisplay(myLibrary);
	} else {
		search(searchStr);
		initDisplay(filteredLibrary);
	}
}

const search = (str) => {
	filteredLibrary = [];
	myLibrary.forEach((book, index) => {
		if (book.title.includes(str) || book.author.includes(str)) {
			filteredLibrary.push(book);
		}
	});
}

const showFilteredView = (e) => {
	if (e.target.classList.contains('nav-link')) {
		document.querySelectorAll('.nav-link').forEach((elem) => {
			elem.classList.remove('active');
		})
		e.target.classList.add('active');
		var id = e.target.id;
		filteredLibrary = [];
		switch (id) {
			case "home":
				initDisplay(myLibrary);
				break;
			case "current":
				myLibrary.forEach((book) => {
					if (book.readPages !== book.pages && book.readPages !== 0)
						filteredLibrary.push(book);
				});	
				initDisplay(filteredLibrary);
				break;
			case "want":
				myLibrary.forEach((book) => {
					if (book.readPages === 0)
						filteredLibrary.push(book);
				});	
				initDisplay(filteredLibrary);
				break;
			case "read":
				myLibrary.forEach((book) => {
					if (book.readPages === book.pages)
						filteredLibrary.push(book);
				});	
				initDisplay(filteredLibrary);
				break;
			default:
				initDisplay(myLibrary);
				break;
		}
	}
}

const validateForm = () => {
	var title = document.querySelector('#book-title').value;
	var author = document.querySelector('#book-author').value;
	var pages = +document.querySelector('#book-pages').value;
	var readPages = +document.querySelector('#book-read-pages').value;
	
	if (title === '' || title === null || title === undefined)
		return 'ERROR: Title must not be blank.';
	if (author === '' || author === null || author === undefined)
		return 'ERROR: Author must not be blank.';
	if (pages < 1)
		return 'ERROR: Total pages cannot be zero or negative.';
	if (readPages > pages || readPages < 0)
		return 'ERROR: Pages read cannot be > total pages or negative.';
	return '';
}

const initDisplay = (arr) => {
	while (cardsContainer.firstChild) {
		cardsContainer.removeChild(cardsContainer.lastChild);
	}
	if (arr === null || arr === undefined) {
		arr = myLibrary;
	}
	if (arr.length == 0) {
		var div = document.createElement('div');
		div.classList.add('text-center','alert','alert-info','col-12', 'my-3');
		div.textContent = 'No records found';
		cardsContainer.appendChild(div);
	} else {
		arr.forEach((book) => {
			buildCard(book);
			totalBooks++;
			if (book.read) {
				booksRead++;
			} else if (book.pages != 0) {
				currentlyReading++;
			}
			pagesRead += book.readPages;
		});
	}
}

const updateStats = () => {
	totalBooks = 0;
	currentlyReading = 0;
	booksRead = 0;
	pagesRead = 0;
	myLibrary.forEach((book, index) => {
		totalBooks++;
		if (!book.read && book.readPages != 0) {
			currentlyReading++;
		}
		if (book.read) {
			booksRead++;
		}
		pagesRead += book.readPages;
	});
}

const updateStatsDisplay = () => {
	totalBooksSpan.textContent = totalBooks;
	currentlyReadingSpan.textContent = currentlyReading;
	booksReadSpan.textContent = booksRead;
	pagesReadSpan.textContent = pagesRead;
}

const showHideElements = (showElem, hideElem) => {
	showElem.classList.remove('d-none');
	hideElem.classList.add('d-none');
}

const addBook = (e) => {
	errorAlert.classList.add('d-none');
	var title = document.querySelector('#book-title').value;
	var author = document.querySelector('#book-author').value;
	var pages = +document.querySelector('#book-pages').value;
	var readPages = +document.querySelector('#book-read-pages').value;
	var read = document.querySelector('#book-read').checked;
	var url = document.querySelector('#book-img-url').value;
	
	var errorMessage = validateForm();
	
	if (errorMessage === '') {
		book = addBookToLibrary(title, author, pages, readPages, read, url);
		if (myLibrary.length === 1)
			cardsContainer.removeChild(cardsContainer.lastChild);
		buildCard(book);
		updateStats();
		updateStatsDisplay();
		bookForm.reset();
		document.querySelector('#book-title').focus();
		saveData();
	} else {
		errorAlert.textContent = errorMessage;
		errorAlert.classList.remove('d-none');
	}
}

const sliderChange = (e) => {
	let id = e.target.id.substring(11);
	let queryid = `#page-display-${id}`;
	let label = document.querySelector(queryid);
	label.textContent = e.target.value;
	if (e.target.value == e.target.max) {
		document.querySelector(`#read-ck-${id}`).checked = true;
		myLibrary[id].read = true;
		currentlyReading--;
		booksRead++;
		
	} else if (document.querySelector(`#read-ck-${id}`).checked == true && e.target.value != e.target.max) {
		document.querySelector(`#read-ck-${id}`).checked = false;
		myLibrary[id].read = false;
		booksRead--;
		currentlyReading++;
	}
	pagesRead -= myLibrary[id].readPages;
	myLibrary[id].readPages = +e.target.value;
	pagesRead += +e.target.value;
	updateStatsDisplay();
	saveData();
}

const readToggle = (e) => {
	var id = e.target.id.substring(8);
	var book = myLibrary[id];
	if (e.target.checked) {
		
		pagesRead -= book.readPages;
		pagesRead += book.pages;
		book.readPages = book.pages;
		book.read = true;
		booksRead++;
		currentlyReading--;
	} else {
		book.readPages--;
		pagesRead--;
		book.read = false;
		book.read = false;
		currentlyReading++;
		booksRead--;
	}
	let slider = document.querySelector(`#read-pages-${id}`);
	slider.value = book.readPages;
	let queryid = `#page-display-${id}`;
	let label = document.querySelector(queryid);
	label.textContent = (book.readPages + '/' + book.pages);
	updateStatsDisplay();
	saveData();
}

const removeBook = (e) => {
	var id = e.target.id.substring(7);
	myLibrary.splice(id, 1);
	initDisplay(myLibrary);
	saveData();
}

const setRead = (e) => {
	var tPages = +document.querySelector('#book-pages').value;
	if (e.target.checked) {
		document.querySelector('#book-read-pages').value = tPages;
	} else {
		document.querySelector('#book-read-pages').value = 0;
	}
}

const updateRead = (e) => {
	var tPages = +document.querySelector('#book-pages').value;
	if (+e.target.value != tPages) {
		document.querySelector('#book-read').checked = false;
	} else {
		document.querySelector('#book-read').checked = true;
	}
}

const editBook = (e) => {
	var id = e.target.id.substring(5);
	var book = myLibrary[id];
	
	document.querySelector('#book-title').value = book.title;
	document.querySelector('#book-author').value = book.author;
	document.querySelector('#book-pages').value = book.pages;
	document.querySelector('#book-read-pages').value = book.readPages;
	document.querySelector('#book-read').checked = book.read;
	document.querySelector('#book-index').value = id;
	document.querySelector('#book-img-url').value = book.url;
	showHideElements(document.querySelector('#edit-title'), document.querySelector('#add-title'));
	showHideElements(document.querySelector('#form-edit-group'), document.querySelector('#form-submit-group'));
	
}

const editLibraryEntry = (e) => {
	errorAlert.classList.add('d-none');
	var index = +document.querySelector('#book-index').value;
	var title = document.querySelector('#book-title').value;
	var author = document.querySelector('#book-author').value;
	var pages = +document.querySelector('#book-pages').value;
	var readPages = +document.querySelector('#book-read-pages').value;
	var read = document.querySelector('#book-read').checked;
	var url = document.querySelector('#book-img-url').value;
	var errorMessage = validateForm();
	
	if (errorMessage === '') {
		var book = myLibrary[index];
		book.title = title;
		book.author = author;
		book.pages = pages;
		book.readPages = readPages;
		book.read = read;
		book.url = url;
		
		updateCard(book);
		updateStats();
		updateStatsDisplay();
		showHideElements(document.querySelector('#add-title'), document.querySelector('#edit-title'));
		showHideElements(document.querySelector('#form-submit-group'), document.querySelector('#form-edit-group'));
		bookForm.reset();
		document.querySelector('#book-title').focus();
		saveData();
	} else {
		errorAlert.textContent = errorMessage;
		errorAlert.classList.remove('d-none');
	}
}

const updateCard = (book) => {
	var index = book.id;
	document.querySelector(`#card-${index} #title-${index}`).textContent = book.title;
	document.querySelector(`#card-${index} #author-${index}`).textContent = book.author;
	document.querySelector(`#card-${index} #read-pages-${index}`)['max'] = book.pages;
	document.querySelector(`#card-${index} #read-pages-${index}`).value = book.readPages;
	document.querySelector(`#card-${index} #page-display-${index}`).textContent = (book.readPages + '/' + book.pages);
	document.querySelector(`#card-${index} #read-ck-${index}`).checked = book.read;
	if (book.url !== '' && book.url !== null && book.url != undefined) {
		if (img) {
			document.querySelector(`#card-${index} #img-${index}`).src = book.url;
		} else {
			let img = document.createElement('img');
			img.src = book.url;
			img.classList.add('img-fluid');
			img['id'] = `img-${index}`;
			document.querySelector(`#card-${index}`).insertBefore(img, document.querySelector(`#card-${index} #pages-div-${index}`));
		}
	} else {
		var img = document.querySelector(`#card-${index} #img-${index}`);
		if (img) {
			document.querySelector(`#card-${index}`).removeChild(img);
		}
	}
}

const buildCard = (book) => {
	var index = book.id;
	let colDiv = document.createElement('div');
	colDiv.classList.add('col-12','col-lg-3','col-md-6', 'd-flex');
	let cardDiv = document.createElement('div');
	cardDiv.classList.add('card','border','border-info','border-3','mx-auto','my-3','flex-fill');
	cardDiv['id'] = `book-${index}`;
	let bodyDiv = document.createElement('div');
	bodyDiv.classList.add('card-body');
	bodyDiv['id'] = `card-${index}`;
	let div = document.createElement('div');
	let title = document.createElement('h4');
	title.classList.add('card-title');
	title.textContent = book.title;
	title['id'] = `title-${index}`;
	let author = document.createElement('h6');
	author.classList.add('card-subtitle','mb-2','text-muted');
	author.textContent = book.author;
	author['id'] = `author-${index}`;
		
	let div2 = document.createElement('div');
	div2.classList.add('mt-4');
	div2['id'] = `pages-div-${index}`;
	let label = document.createElement('label');
	label['for'] = 'readPages'
	label.classList.add('form-label','text-muted','m-0');
	label.textContent= 'Pages Read:';
	let sliderDiv = document.createElement('div');
	sliderDiv.classList.add('d-flex','justify-content-between');
	let slider = document.createElement('input');
	slider['type'] = 'range'
	slider.classList.add('form-range');
	slider['min'] = 0;
	slider['max'] = book.pages;
	slider.value = book.readPages;
	slider['id'] = `read-pages-${index}`;
	slider['aria-label'] = `${book.title} Pages Read`;
	slider.onchange = sliderChange;
	
	let readPages = document.createElement('span');
	readPages.classList.add('text-muted','ms-2');
	readPages.textContent = (book.readPages + '/' + book.pages);
	readPages['id'] = `page-display-${index}`;
	let readCk = document.createElement('input');
	readCk.classList.add('form-check-input');
	readCk['type'] = 'checkbox';
	readCk['id'] = `read-ck-${index}`;
	if (book.readPages == book.pages) {
		readCk.checked = true;
	} else {
		readCk.checked = false;
	}
	readCk.onchange = readToggle;
	let ckLabel = document.createElement('label');
	ckLabel.classList.add('form-check-label','ms-1');
	ckLabel['for'] = `read-ck-${index}`;
	ckLabel.textContent = 'Read';
	
	let footer = document.createElement('div');
	footer.classList.add('card-footer','d-flex','justify-content-end');
	let removeBtn = document.createElement('div');
	removeBtn.classList.add('btn','btn-outline-danger','btn-sm','px-2','mx-1');
	removeBtn.textContent = 'Remove';
	removeBtn['id'] = `remove-${index}`;
	removeBtn.onclick = removeBook;
	let editBtn = document.createElement('div');
	editBtn.classList.add('btn','btn-outline-success','btn-sm','px-4','mx-1');
	editBtn.textContent = 'Edit';
	editBtn['id'] = `edit-${index}`;
	editBtn.onclick = editBook;
	
	div.appendChild(title);
	div.appendChild(author);
	bodyDiv.appendChild(div);	
	if (book.url !== '' && book.url !== undefined && book.url !== null) {
		let img = document.createElement('img');
		img.src = book.url;
		img.classList.add('img-fluid');
		img['id'] = `img-${index}`;
		bodyDiv.appendChild(img);
	}
	sliderDiv.appendChild(slider);
	sliderDiv.appendChild(readPages);
	div2.appendChild(label);
	div2.appendChild(sliderDiv);
	div2.appendChild(readCk);
	div2.appendChild(ckLabel);
	bodyDiv.appendChild(div2);
	cardDiv.appendChild(bodyDiv);
	footer.appendChild(removeBtn);
	footer.appendChild(editBtn);
	cardDiv.appendChild(footer);
	colDiv.appendChild(cardDiv);
	
	cardsContainer.appendChild(colDiv);
}

const storageAvailable = (type) => {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x,x);
		storage.removeItem(x);
		return true;
	} catch (error) {
		return error instanceof DOMException && (
			error.code === 22 ||
			error.code === 1014 ||
			error.name === 'QuotaExceeededError' ||
			error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			(storage & storage.length !== 0);
	}
}

const loadData = () => {
	if (storageAvailable('localStorage')) {
		if (!localStorage.getItem('bookData')) {
			localStorage.setItem('bookData', JSON.stringify(myLibrary));
		} else {
			myLibrary = JSON.parse(localStorage.getItem('bookData'));
		}
	} else {
		myLibrary = [];
	}
}

const saveData = () => {
	if (storageAvailable('localStorage')) {
		localStorage.setItem('bookData', JSON.stringify(myLibrary));
	}
}

window.addEventListener('DOMContentLoaded', () => {
	cardsContainer = document.querySelector('#cardsContainer');
	totalBooksSpan = document.querySelector('#totalBooks');
	currentlyReadingSpan = document.querySelector('#reading');
	booksReadSpan = document.querySelector('#booksRead');
	pagesReadSpan = document.querySelector('#pagesRead');
	bookForm = document.querySelector('#book-form');
	errorAlert = document.querySelector('#error-alert');
	
	document.querySelector('#form-submit').addEventListener('click', addBook);
	document.querySelector('#form-edit').addEventListener('click', editLibraryEntry);
	document.querySelector('#book-read').addEventListener('change', setRead);
	document.querySelector('#book-read-pages').addEventListener('change', updateRead);
	document.querySelector('#search-btn').addEventListener('click', runSearch);
	document.querySelector('.navbar').addEventListener('click', showFilteredView);
	loadData();
	initDisplay(myLibrary);
	updateStatsDisplay();
})
