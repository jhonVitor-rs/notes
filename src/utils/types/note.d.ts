export interface Note {
  id: string;
  title: string;
  content: string;
  fatherId: string | null;
  chidrens: Note[]
  createdAt: Date
}

export interface NotesList {
  noteId: string
}