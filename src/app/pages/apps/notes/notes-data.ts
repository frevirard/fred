import { Note } from './note';

export const notes: Note[] = [
  {
    color: 'primary',
    title:
      'Frédéric a prévu de livrer l appli le 12 de ce mois',
    datef: new Date('1/3/2025'),
    auteur:''
  },
  {
    color: 'error',
    title:
      'Mohamed aide Sylvain à rédiger la formation',
    datef: new Date('1/2/2025'),
    auteur:''
  },
  {
    color: 'warning',
    title:
      'Le pol TF doit faire la présentation du support ',
    datef: new Date('1/1/2025'),
    auteur:''
  },
  {
    color: 'success',
    title:
    'Ne pas oublier de remplir les formulaires du séminaire Lendys',
    datef: new Date('1/1/2025'),
    auteur:''
  },
];
