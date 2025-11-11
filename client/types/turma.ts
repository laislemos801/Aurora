export interface Aluno {
  nome: string;
  ra: number | null;
}

export interface Turma {
  nome: string;
  alunos?: Aluno[]; 
  arquivo?: File | null; 
}
