document.addEventListener('DOMContentLoaded', () => {
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const addNoteButton = document.getElementById('add-note');
    const notesContainer = document.getElementById('notes-container');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let isEditing = false;
    let editingIndex = null;

    const saveNotes = () => {
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    const renderNotes = () => {
        notesContainer.innerHTML = '';
        notes.forEach((note, index) => {
            // Ensure note has a position property
            if (!note.position) {
                note.position = { left: '0px', top: '0px' };
            }

            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.setAttribute('data-index', index);
            noteElement.style.left = note.position.left;
            noteElement.style.top = note.position.top;
            noteElement.style.transform = `translate(${note.position.left}, ${note.position.top})`;
            noteElement.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-content">${note.content}</div>
                <div class="note-buttons">
                    <button class="edit-button" onclick="editNote(${index})">Edit</button>
                    <button class="delete-button" onclick="deleteNote(${index})">Delete</button>
                </div>
            `;
            notesContainer.appendChild(noteElement);
            makeDraggable(noteElement);
        });
    };

    const addNote = () => {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();

        if (title && content) {
            if (isEditing) {
                notes[editingIndex] = {
                    ...notes[editingIndex],
                    title,
                    content
                };
                isEditing = false;
                editingIndex = null;
                addNoteButton.textContent = 'Add Note';
            } else {
                notes.push({ 
                    title, 
                    content, 
                    position: { left: '0px', top: '0px' } 
                });
            }

            saveNotes();
            renderNotes();
            noteTitle.value = '';
            noteContent.value = '';
        }
    };

    window.editNote = (index) => {
        const note = notes[index];
        noteTitle.value = note.title;
        noteContent.value = note.content;
        isEditing = true;
        editingIndex = index;
        addNoteButton.textContent = 'Update Note';
    };

    window.deleteNote = (index) => {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
    };

    const makeDraggable = (element) => {
        interact(element)
            .draggable({
                onmove: (event) => {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                onend: (event) => {
                    const index = event.target.getAttribute('data-index');
                    const x = event.target.getAttribute('data-x');
                    const y = event.target.getAttribute('data-y');

                    notes[index].position.left = `${x}px`;
                    notes[index].position.top = `${y}px`;

                    saveNotes();
                }
            });
    };

    addNoteButton.addEventListener('click', addNote);
    renderNotes();
});
