import { Routes } from '@angular/router';
import { Inscricoes } from './pages/inscricoes/inscricoes';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'inscricoes',
        pathMatch: 'full'
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
