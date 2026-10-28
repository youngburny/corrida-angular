import { Routes } from '@angular/router';
import { Inscricoes } from './pages/inscricoes/inscricoes';
import { FormularioInscricao } from './pages/formulario-inscricao/formulario-inscricao';
import { DetalhesInscricao } from './pages/detalhes-inscricao/detalhes-inscricao';
import { PaginaNaoEncontrada } from './pages/pagina-nao-encontrada/pagina-nao-encontrada';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'inscricoes',
        pathMatch: 'full'
    },

    {
        path: 'inscricoes/nova-inscricao',
        component: FormularioInscricao
    },

    {
        path: 'inscricoes/:email',
        component: DetalhesInscricao
    },

    {
        path: 'inscricoes',
        component: Inscricoes
    },

    {
        path: '**',
        component: PaginaNaoEncontrada
    }
];
