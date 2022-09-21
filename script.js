const addBox = document.querySelector('.add-box');
const popupBox = document.querySelector('.popup-box');
const popupTitle = document.querySelector('header p');
const closeIcon = popupBox.querySelector('.Xicon');
const titleTag = popupBox.querySelector('input');
const descTag = popupBox.querySelector('textarea');
const addBtn = popupBox.querySelector('button');

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

//Get local storage notes and parse them to js object if they exist
//else pass an empty array
const notes = JSON.parse(localStorage.getItem('notes') || '[]');
let isUpdate = false;
let updateID;

addBox.addEventListener('click', () => {
  popupBox.classList.add('show');
  titleTag.focus();
});

closeIcon.addEventListener('click', () => {
  isUpdate = false;
  popupBox.classList.remove('show');
  titleTag.value = '';
  descTag.value = '';
  addBtn.innerHTML = 'Add Note';
  popupTitle.innerHTML = 'Add a new Note';
});

function showNotes() {
  document.querySelectorAll('.note').forEach((note) => note.remove());
  notes.forEach((note, index) => {
    let liTag = ` <li class="note">
                        <div class="details">
                        <p>${note.title}</p>
                        <span>${note.description}</span>
                         </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-elipsis-double-v-alt"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i> Delete</li>  
                                </ul>   
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML('afterend', liTag);
  });
}

showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add('show');
  document.addEventListener('click', (e) => {
    //  removes show class from the settings menu on document click
    if (e.target.tagName != 'I' || e.target != elem) {
      elem.parentElement.classList.remove('show');
    }
  });
}

function deleteNote(noteId) {
  let confrimDel = confirm('Are you sure you want to delete this note?');
  if (!confrimDel) return;
  notes.splice(noteId, 1); //removes selected note from notes array
  // saves updated notes aray to local storage
  localStorage.setItem('notes', JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, description) {
  isUpdate = true;
  updateID = noteId;
  addBox.click();
  addBtn.innerHTML = 'Update Note';
  popupTitle.innerHTML = 'Update A Note';
  titleTag.value = title;
  descTag.value = description;
  console.log(noteId, title, description);
}

addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let noteTitle = titleTag.value;
  let noteDesc = descTag.value;

  if (noteTitle || noteDesc) {
    //get current month, day, year from the current date.
    let dateObj = new Date();
    let month = months[dateObj.getMonth()];
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();

    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${month} ${day} ${year}`,
    };

    if (!isUpdate) {
      notes.push(noteInfo); //adding new note to notes list
    } else {
      isUpdate = false;
      notes[updateID] = noteInfo; //updating specified note
    }

    // saving notes to local storage
    localStorage.setItem('notes', JSON.stringify(notes));
    closeIcon.click();
    showNotes();
  }
});
