import { Routes } from '@angular/router';
import { Inscricoes } from './pages/inscricoes/inscricoes';
import { FormularioInscricao } from './pages/formulario-inscricao/formulario-inscricao';

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
        path: 'inscricoes',
        component: Inscricoes
    },

    {
        path: '**',
        redirectTo: 'inscricoes'
    }
];
